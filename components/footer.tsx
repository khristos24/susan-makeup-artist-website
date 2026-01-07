import Link from "next/link"
import { Instagram, MessageCircle, MapPin, Phone } from "lucide-react"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-[#FFFFFF]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="text-2xl font-semibold">
            BeautyHome<span className="text-[#FFFFFF]">BySuzain</span>
          </h3>
          <p className="mt-3 text-[#FFFFFF]">Luxury Bridal & Glam Makeup Artist</p>
          <p className="text-[#FFFFFF]">Susan Eworo (Suzain)</p>
        </div>

        <div>
          <h4 className="mb-4 uppercase tracking-wider text-sm text-[#FFFFFF]">
            Quick Links
          </h4>
          <ul className="space-y-2 text-[#FFFFFF]">
            <li>
              <Link href="/services" className="transition-colors hover:text-[#E5E5E5]">
                Services
              </Link>
            </li>
            <li>
              <Link href="/catalogue" className="transition-colors hover:text-[#E5E5E5]">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/packages" className="transition-colors hover:text-[#E5E5E5]">
                Packages & Pricing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-[#E5E5E5]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 uppercase tracking-wider text-sm text-[#FFFFFF]">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-[#FFFFFF]">
            <li className="flex items-center space-x-2">
              <MapPin size={18} className="text-[#FFFFFF]" />
              <span>London · Manchester · Birmingham</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin size={18} className="text-[#FFFFFF]" />
              <span>Leeds · Sheffield · Bradford</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin size={18} className="text-[#FFFFFF]" />
              <span>Available to travel to any country</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={18} className="text-[#FFFFFF]" />
              <a href="tel:+447523992614" className="transition-colors hover:text-[#E5E5E5]">
                +44 7523 992614
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <MessageCircle size={18} className="text-[#FFFFFF]" />
              <a
                href="https://wa.me/447523992614"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#E5E5E5]"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Instagram size={18} className="text-[#FFFFFF]" />
              <a
                href="https://instagram.com/beautyhomebysuzain"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#E5E5E5]"
              >
                @beautyhomebysuzain
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-[#FFFFFF]">
        <p>&copy; {year} BeautyHomeBySuzain. All rights reserved.</p>
        <p className="mt-2 text-sm text-[#E5E5E5]">
          <strong>No refund policy</strong> | Travel available
        </p>
      </div>
    </footer>
  )
}
