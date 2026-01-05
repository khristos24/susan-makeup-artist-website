import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signSession, verifySession, COOKIE_NAME } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { rateLimit } from "@/lib/rateLimit";

const fallbackSettings = {
  admin: {
    username: "susan",
    // bcrypt hash for "ChristisKing8"
    passwordHash: "$2a$10$jAqm0vQ9d3JongjNrqUgc.EL4Ntwaz0U0Olqo7AXlTCv9oughtdw2", 
  },
};

export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value;
  // Await async session verification
  if (await verifySession(token)) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const limited = rateLimit(req, { key: "auth:login", max: 5, windowMs: 60_000 })
  if (limited.blocked && limited.response) return limited.response as any
  const { username, password } = await req.json();
  const normalizedUser = typeof username === "string" ? username.trim().toLowerCase() : "";

  // Pull live admin credentials from website settings
  let admin: any = null;
  try {
    const settings = await getContent("settings");
    admin = settings?.admin;
  } catch (err) {
    console.error("Settings fetch error", err);
  }

  // Normalize admin credentials from settings (support passwordHash or plaintext password)
  const settingsAdmin = admin && typeof admin === "object" ? admin : {}
  const adminUsername = String(settingsAdmin.username || "susan")
  const adminPasswordHash = typeof settingsAdmin.passwordHash === "string" ? settingsAdmin.passwordHash : null
  const adminPasswordPlain = typeof settingsAdmin.password === "string" ? settingsAdmin.password : null

  // If neither hash nor plaintext provided, fall back to built-in defaults
  const usingFallback = !adminPasswordHash && !adminPasswordPlain
  const effectiveAdmin: any =
    usingFallback
      ? fallbackSettings.admin
      : { username: adminUsername, passwordHash: adminPasswordHash, password: adminPasswordPlain }

  if (normalizedUser !== String(effectiveAdmin.username).toLowerCase()) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // If using built-in fallback, accept the default plaintext for compatibility
  let ok = false
  if (usingFallback) {
    ok = password === "ChristisKing8"
  } else {
    if (effectiveAdmin.passwordHash) {
      ok = await bcrypt.compare(password, effectiveAdmin.passwordHash)
    } else if (typeof effectiveAdmin.password === "string") {
      ok = password === effectiveAdmin.password
    }
  }
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Sign session with UTC expiration (24 hours)
  const token = await signSession(effectiveAdmin.username);
  const res = NextResponse.json({ ok: true });
  
  // Set cookie with explicit UTC expiration date
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  return res;
}
