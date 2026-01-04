import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verifySession, COOKIE_NAME } from "@/lib/auth"
import { sql } from "@/lib/db"
import { rateLimit } from "@/lib/rateLimit"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD
const BLOB_BUCKET = process.env.BLOB_BUCKET || process.env.NEXT_PUBLIC_BLOB_BUCKET || "susan-makeup-artist-website-blob"
const BLOB_BASE_URL =
  process.env.BLOB_BASE_URL ||
  process.env.NEXT_PUBLIC_BLOB_BASE_URL ||
  `https://${BLOB_BUCKET}.public.blob.vercel-storage.com`
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_RW_TOKEN ||
  process.env.BLOB_READ_WRITE_TOKEN
const BOOKINGS_BLOB_URL = `${BLOB_BASE_URL}/bookings/bookings.json`

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "admin:bookings", max: 20, windowMs: 60_000 })
  if (limited.blocked && limited.response) return limited.response
  const token = cookies().get(COOKIE_NAME)?.value
  const isSessionValid = await verifySession(token)
  
  const provided = request.headers.get("x-admin-key") || new URL(request.url).searchParams.get("key")
  
  if (!isSessionValid && (!ADMIN_PASSWORD || provided !== ADMIN_PASSWORD)) {
      return unauthorized()
  }

  const status = new URL(request.url).searchParams.get("status")

  try {
    const conn = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL
    if (!conn) {
      const existing = await fetch(BOOKINGS_BLOB_URL, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => [])
      const list = Array.isArray(existing) ? existing : []
      const filtered = status ? list.filter((b: any) => b.status === status) : list
      return NextResponse.json({ bookings: filtered })
    }
    const bookings = status
      ? await sql`SELECT * FROM bookings WHERE status = ${status} ORDER BY created_at DESC LIMIT 200`
      : await sql`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200`
    return NextResponse.json({ bookings: bookings.rows })
  } catch (error) {
    console.error("Fetch bookings error", error)
    try {
      const existing = await fetch(BOOKINGS_BLOB_URL, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => [])
      const list = Array.isArray(existing) ? existing : []
      const filtered = status ? list.filter((b: any) => b.status === status) : list
      return NextResponse.json({ bookings: filtered })
    } catch {
      return NextResponse.json({ bookings: [] })
    }
  }
}
