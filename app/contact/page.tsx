'use client'

import { motion } from "motion/react"
import { Clock, Instagram, MapPin, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { getSection } from "@/lib/api"

export default function ContactPage() {
  type ContactData = {
    phone?: string
    whatsapp?: string
    whatsappLink?: string
    email?: string
    social?: { instagram?: string; facebook?: string }
    ctaLabel?: string
    ctaLink?: string
    address?: { lines?: string[] }
    travelNote?: string
  }

  const defaultContact: ContactData = {
    phone: "+44 7523 992614",
    whatsapp: "+44 7523 992614",
    whatsappLink: "https://wa.me/447523992614",
    email: "beautyhomebysuzain@gmail.com",
    social: { instagram: "https://instagram.com/beautyhomebysuzain", facebook: "" },
    ctaLabel: "Book Appointment",
    ctaLink: "/book",
    address: { lines: ["London & across the UK"] },
    travelNote: "Available to travel to any country.",
  }

  const [contact, setContact] = useState<ContactData>(defaultContact)

  useEffect(() => {
    let mounted = true
    getSection("contact")
      .then((data) => {
        if (mounted) setContact(data)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const whatsappLink = contact.whatsappLink || defaultContact.whatsappLink!
  const whatsappText = contact.whatsapp || defaultContact.whatsapp!
  const phoneText = contact.phone || defaultContact.phone!
  const instagramUrl = contact.social?.instagram || defaultContact.social?.instagram!
  const instagramHandle =
    instagramUrl
      ?.replace(/https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/\/$/, "") || "Instagram"
  const addressLines = contact.address?.lines && contact.address.lines.length > 0 ? contact.address.lines : defaultContact.address!.lines!
  const travelNote = contact.travelNote || defaultContact.travelNote!

  return (
    <div className="bg-white text-black">
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)]"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-[#666666] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
          >
            Book your appointment today.
          </motion.p>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#E5E5E5]" />
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group border border-[#E5E5E5] bg-white p-8 transition-all hover:border-black"
            >
              <div className="flex items-start gap-6">
                <div className="bg-[#F5F5F5] p-4 transition-colors group-hover:bg-[#E5E5E5]">
                  <Phone size={32} className="text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl uppercase tracking-wider">WhatsApp Booking</h3>
                  <p className="mt-2 text-[#666666]">Book directly via WhatsApp for instant confirmation.</p>
                  <p className="mt-3 text-lg text-black">{whatsappText}</p>
                  <p className="mt-2 text-sm text-[#666666]">Tap to chat now.</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group border border-[#E5E5E5] bg-white p-8 transition-all hover:border-black"
            >
              <div className="flex items-start gap-6">
                <div className="bg-[#F5F5F5] p-4 transition-colors group-hover:bg-[#E5E5E5]">
                  <Instagram size={32} className="text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl uppercase tracking-wider">Instagram DM</h3>
                  <p className="mt-2 text-[#666666]">Send us a direct message on Instagram.</p>
                  <p className="mt-3 text-lg text-black">@{instagramHandle}</p>
                  <p className="mt-2 text-sm text-[#666666]">Follow and message us.</p>
                </div>
              </div>
            </motion.a>
          </div>

          <div className="mt-16 border border-[#E5E5E5] bg-white p-8">
            <h3 className="font-display text-center text-3xl text-black">Business Information</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <MapPin size={24} className="mt-1 flex-shrink-0 text-black" />
                <div>
                  <h4 className="text-lg uppercase tracking-wider">Locations</h4>
                  <div className="mt-3 space-y-2 text-[#666666]">
                    {addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    <p className="mt-3 text-[#666666]">{travelNote}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={24} className="mt-1 flex-shrink-0 text-black" />
                <div>
                  <h4 className="text-lg uppercase tracking-wider">Availability</h4>
                  <div className="mt-3 space-y-2 text-[#666666]">
                    <p>By appointment only</p>
                    <p>Limited slots available</p>
                    <p className="mt-3 text-sm text-[#666666]">Book in advance to secure your preferred date.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="border border-[#E5E5E5] bg-white p-8">
            <h3 className="font-display text-center text-2xl text-black">Booking Guidelines</h3>
            <div className="mt-6 space-y-6">
              <div className="border-l-4 border-[#E5E5E5] pl-6">
                <h4 className="text-sm uppercase tracking-wider text-black">Booking Fee Required</h4>
                <p className="text-sm text-[#666666]">
                  A booking fee is required to secure your appointment. This fee is non-refundable and will be deducted
                  from your total package cost.
                </p>
              </div>
              <div className="border-l-4 border-[#E5E5E5] pl-6">
                <h4 className="text-sm uppercase tracking-wider text-black">No Refund Policy</h4>
                <p className="text-sm text-[#666666]">
                  All payments are final. Please ensure your date is confirmed before booking. Reschedules may be
                  accommodated based on availability.
                </p>
              </div>
              <div className="border-l-4 border-[#E5E5E5] pl-6">
                <h4 className="text-sm uppercase tracking-wider text-black">Travel Fees</h4>
                <p className="text-sm text-[#666666]">
                  Travel fees may apply depending on your location. Contact us for a detailed quote specific to your
                  area.
                </p>
              </div>
              <div className="border-l-4 border-[#E5E5E5] pl-6">
                <h4 className="text-sm uppercase tracking-wider text-black">Limited Availability</h4>
                <p className="text-sm text-[#666666]">
                  We have limited slots available each month. Book early to secure your preferred date and time,
                  especially for bridal and special event bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="font-display text-3xl text-black md:text-4xl">Follow Our Journey</h3>
          <p className="mt-4 text-[#666666]">
            Stay updated with our latest work, exclusive offers, and beauty tips.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-black transition-colors hover:text-[#666666]"
            >
              <Instagram size={32} />
              <span className="text-lg">@{instagramHandle}</span>
            </a>
          </div>

          <div className="mt-12 border border-[#E5E5E5] bg-[#F5F5F5] p-8">
            <p className="text-[#666666]">Have questions? Need more information about our services?</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1A1A1A]"
            >
              WhatsApp: {whatsappText}
            </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border-2 border-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-[#F5F5F5]"
              >
                Instagram Direct
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="border border-[#E5E5E5] bg-white p-12 text-center">
            <MapPin size={48} className="mx-auto mb-6 text-black" />
            <h3 className="font-display text-2xl text-black">Service Areas</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h4 className="text-xl text-black">United Kingdom</h4>
                {addressLines.map((line) => (
                  <p key={line} className="text-[#666666]">{line}</p>
                ))}
              </div>
              <div>
                <h4 className="text-xl text-black">Worldwide Travel</h4>
                <p className="text-[#666666]">{travelNote}</p>
                <p className="mt-2 text-sm text-[#666666]">Get in touch for bespoke bookings.</p>
              </div>
            </div>
            <p className="mt-8 text-[#666666]">{travelNote}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
