import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const limited = rateLimit(req, { key: "auth:recover", max: 3, windowMs: 60 * 60 * 1000 }) // 3 attempts per hour
  if (limited.blocked && limited.response) return limited.response as any

  try {
    const { recoveryKey, newPassword } = await req.json();

    if (!recoveryKey || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Invalid request. Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const settings = await getContent("settings");
    const admin = settings?.admin || {};

    if (!admin.recoveryKeyHash) {
      return NextResponse.json(
        { error: "Recovery is not configured. Please contact the administrator." },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(recoveryKey, admin.recoveryKeyHash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid recovery key" }, { status: 401 });
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const newSettings = {
      ...settings,
      admin: {
        ...admin,
        passwordHash,
        password: null, // Remove plaintext if exists
      },
    };

    await saveContent("settings", newSettings);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Recovery error:", error);
    return NextResponse.json(
      { error: "An error occurred during recovery" },
      { status: 500 }
    );
  }
}
