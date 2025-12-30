'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/catalogue", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const linkClasses = (href: string) =>
    `text-sm tracking-wide transition-colors ${
      pathname === href ? "text-[#C9A24D]" : "text-[#E6D1C3]"
    } hover:text-[#C9A24D]`

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#C9A24D]/30 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-wider text-[#c08b2f]">
          BeautyHomeBySuzain
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="rounded bg-[#C9A24D] px-6 py-2.5 text-sm font-semibold text-[#1c1208] transition-colors hover:bg-[#e8d6b5]"
          >
            Book Now
          </Link>
        </div>

        <button
          className="md:hidden text-[#c08b2f]"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-[#C9A24D]/30 bg-white px-4 py-6 space-y-4 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`${linkClasses(link.href)} block w-full text-left py-2`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setIsOpen(false)}
            className="block w-full rounded bg-[#C9A24D] px-6 py-3 text-center text-sm font-semibold text-[#1c1208] transition-colors hover:bg-[#e8d6b5]"
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}
