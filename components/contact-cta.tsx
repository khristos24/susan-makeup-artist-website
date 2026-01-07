import Link from "next/link"
import { Instagram, Phone } from "lucide-react"

export default function ContactCta() {
  return (
    <section className="bg-[#F5F5F5] px-4 py-16" id="contact">
      <div className="mx-auto max-w-4xl text-center">
        <h3 className="font-display text-3xl text-black md:text-4xl">Ready to Book Your Appointment?</h3>
        <p className="mt-4 text-[#666666]">
          Limited slots available. Reach out via WhatsApp or send us a message to secure your date.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/447523992614"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] transition-colors hover:bg-[#1A1A1A]"
          >
            <Phone size={18} />
            WhatsApp: +44 7523 992614
          </a>
          <Link
            href="/contact"
            className="inline-block rounded border-2 border-white bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-black hover:border-black hover:text-[#FFFFFF]"
          >
            Get in Touch
          </Link>
          <a
            href="https://instagram.com/beautyhomebysuzain"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-[#F5F5F5]"
          >
            <Instagram size={18} />
            Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
