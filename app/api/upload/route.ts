import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "upload:post", max: 5, windowMs: 60_000 })
  if (limited.blocked && limited.response) return limited.response
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_TOKEN,
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
