import { NextResponse, type NextRequest } from "next/server"
import Stripe from "stripe"

import { sql } from "../../../../lib/db"

const stripeSecret = process.env.STRIPE_SECRET_KEY
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

export async function GET(request: NextRequest) {
  if (!stripeSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2025-12-15.clover" })
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] })
    const paid = session.payment_status === "paid"
    const reference = (session.metadata?.booking_reference as string | undefined) || null

    const conn = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL
    if (paid) {
      if (conn) {
        await sql`
          UPDATE bookings
          SET status = 'paid'
          WHERE stripe_session_id = ${sessionId}
        `
      } else if (BLOB_TOKEN) {
        const existing = await fetch(BOOKINGS_BLOB_URL, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => [])
        const next = Array.isArray(existing)
          ? existing.map((b: any) => (b.stripe_session_id === sessionId ? { ...b, status: "paid" } : b))
          : existing
        await fetch(BOOKINGS_BLOB_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${BLOB_TOKEN}` },
          body: JSON.stringify(next),
        })
      }
    }

    let booking: any = null
    if (conn) {
      const bookingResult = await sql`
        SELECT *
        FROM bookings
        WHERE stripe_session_id = ${sessionId}
        LIMIT 1
      `
      booking = bookingResult.rows[0] || null
    } else {
      const existing = await fetch(BOOKINGS_BLOB_URL, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => [])
      if (Array.isArray(existing)) {
        booking = existing.find((b: any) => b.stripe_session_id === sessionId) || null
      }
    }

    return NextResponse.json({
      status: paid ? "paid" : session.payment_status,
      booking,
      reference,
    })
  } catch (error) {
    console.error("Verify error", error)
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 })
  }
}
