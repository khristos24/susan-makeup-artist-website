'use client'

import Link from "next/link"
import { Camera, GraduationCap, Heart, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { getSection } from "@/lib/api"

const defaultServices = [
  {
    icon: Heart,
    title: "Bridal Glam",
    description:
      "Flawless bridal makeup designed to make you shine on your special day. Includes trial sessions and a luxury experience.",
    highlights: ["Trial session", "Full bridal look", "Touch-up service"],
  },
  {
    icon: Sparkles,
    title: "Birthday Glam",
    description:
      "Celebrate in style with birthday glam packages that cover makeup and photoshoot-ready finishes.",
    highlights: ["Signature glam", "Birthday photoshoot", "Edited photos"],
  },
  {
    icon: Camera,
    title: "Editorial Glam",
    description:
      "Professional makeup for photoshoots, events, and special occasions. High-definition, camera-ready perfection.",
    highlights: ["HD makeup", "Event ready", "Long-lasting"],
  },
  {
    icon: GraduationCap,
    title: "Makeup Training",
    description:
      "Hands-on training for aspiring makeup artists. Learn professional techniques and build confidence.",
    highlights: ["One-on-one training", "Pro tips", "Certificate"],
  },
]

export default function ServicesSection() {
  const [services, setServices] = useState(defaultServices)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getSection("services")
        const list = Array.isArray(data?.services) ? data.services : []
        if (list.length) {
          const mapped = list.map((s: any) => ({
            icon:
              /bridal/i.test(s.title) ? Heart :
              /birthday/i.test(s.title) ? Sparkles :
              /editorial|photoshoot/i.test(s.title) ? Camera :
              /training/i.test(s.title) ? GraduationCap :
              Sparkles,
            title: s.title,
            description: s.description,
            highlights: s.features || s.deliverables || [],
          }))
          setServices(mapped)
        }
      } catch {
        /* keep defaults */
      }
    })()
  }, [])

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="section-eyebrow mb-4 text-sm text-[#666666]">What We Offer</p>
          <h2 className="font-display text-4xl text-black md:text-6xl">Luxury Makeup Services</h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-black" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="rounded-lg border border-[#E5E5E5] bg-white p-8 shadow-xs transition-all hover:border-black hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">
                  <Icon className="text-[#FFFFFF]" size={28} />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-black">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#666666]">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-xs uppercase text-[#666666]">
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-block rounded border-2 border-black bg-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] transition-all hover:bg-transparent hover:text-black"
          >
            View All Services
          </Link>
        </div>

        <div className="mt-16 rounded-lg bg-black p-10 text-center md:p-12">
          <h3 className="font-display text-3xl uppercase text-[#FFFFFF] md:text-4xl">
            Makeup Training & Mentorship
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-[#FFFFFF]/70">
            Hands-on training for aspiring artists looking to refine their skills, learn professional techniques, and
            build confidence in real-world glam applications.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex rounded bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-[#F5F5F5]"
            >
              Enquire About Training
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
