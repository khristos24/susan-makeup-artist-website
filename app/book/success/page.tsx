'use client'
'use client'

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

type Booking = {
  reference: string
  package_name: string
  appointment_date: string
  time_window: string
  country: string
  city: string
  status: string
  customer_name: string
}

function BookingSuccessInner() {
  const params = useSearchParams()
  const reference = params.get("reference")
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#E5E5E5] bg-white p-10 shadow-lg">
        <p className="text-sm uppercase tracking-[0.2em] text-black">Booking Confirmed</p>
        <h1 className="mt-3 font-display text-4xl text-black">
          Booking Pending Payment
        </h1>
        <p className="mt-3 text-[#666666]">
          Your booking has been received. Please complete the bank transfer below to secure your slot.
        </p>

        <div className="mt-8 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] p-6 text-black">
          <h3 className="mb-4 font-display text-xl text-black">Bank Transfer Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666]">Bank Name</span>
              <span className="font-semibold">Revolut Ltd</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666]">Account Name</span>
              <span className="font-semibold">Susan Eworo</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666]">Sort Code</span>
              <span className="font-mono font-semibold">23-01-20</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666]">Account Number</span>
              <span className="font-mono font-semibold">12540936</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between pb-2">
                <span className="text-[#666666]">Reference</span>
                <span className="font-mono font-bold text-black">{reference || "YOUR_NAME"}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#999999]">
            * Please use the reference code <strong>{reference}</strong> (or your name) when making the transfer so we can identify your payment.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={`https://wa.me/447523992614?text=${encodeURIComponent(
              `Hi Susan, I just booked! Ref: ${reference || "N/A"}. I will make the transfer shortly.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded bg-black px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] transition hover:bg-[#1A1A1A]"
          >
            Notify via WhatsApp
          </a>
          <Link
            href="/"
            className="flex-1 rounded border border-black px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#F5F5F5]"
          >
            Back to Home
          </Link>
          <Link
            href="/packages"
            className="flex-1 rounded border border-black px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#F5F5F5]"
          >
            View Packages
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#666666]">Loading confirmation...</div>}>
      <BookingSuccessInner />
    </Suspense>
  )
}
