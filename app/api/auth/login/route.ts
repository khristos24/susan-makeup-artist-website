import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signSession, verifySession, COOKIE_NAME } from "@/lib/auth";
import { SITE_ORIGIN } from "@/lib/api";
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
    const settingsRes = await fetch(`${SITE_ORIGIN}/api/content/settings`, { cache: "no-store" });
    if (settingsRes.ok) {
      const settings = await settingsRes.json();
      admin = settings?.admin;
    }
  } catch (err) {
    console.error("Settings fetch error", err);
  }

  // fallback to built-in defaults if remote unavailable or empty
  if (!admin || !admin.username) {
    admin = fallbackSettings.admin;
  }

  if (!admin?.username || !admin?.passwordHash) {
    admin = fallbackSettings.admin;
  }

  if (normalizedUser !== String(admin.username).toLowerCase()) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // If using built-in fallback, accept the default plaintext for compatibility
  let ok = false
  if (admin === fallbackSettings.admin) {
    ok = password === "ChristisKing8"
  } else {
    ok = await bcrypt.compare(password, admin.passwordHash)
  }
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Sign session with short UTC expiration (10 minutes)
  const token = await signSession(admin.username);
  const res = NextResponse.json({ ok: true });
  
  // Set cookie with explicit short UTC expiration date
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 10 * 60 * 1000),
  });
  return res;
}
