'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getSection, withSite } from "@/lib/api"

export default function AboutSection() {
  const [about, setAbout] = useState<any>(null)
  useEffect(() => {
    ;(async () => {
      try {
        const data = await getSection("about")
        if (data?.about) setAbout(data.about)
      } catch {
        /* use defaults below */
      }
    })()
  }, [])

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-lg bg-[#F5F5F5]" />
          <div className="relative h-[500px] w-full">
            <Image
              src={withSite(about?.image || "/assets/IMG-20251227-WA0028.jpg")}
              alt={about?.imageAlt || "Susan Eworo - Makeup Artist"}
              fill
              className="rounded-lg object-cover shadow-2xl"
              style={{ objectPosition: "center 30%" }}
            />
          </div>
        </div>

        <div>
          <p className="section-eyebrow mb-4 text-sm text-black">About BeautyHomeBySuzain</p>
          <h2 className="font-display text-4xl text-black md:text-5xl">
            {about?.title || "Susan Eworo (Suzain)"}
          </h2>
          <div className="my-6 h-1 w-20 bg-black" />

          <p className="mb-6 leading-relaxed text-[#2A2A2A]">
            {about?.bio ||
              "BeautyHomeBySuzain is a luxury makeup brand led by Susan Eworo, a celebrity and bridal makeup artist delivering flawless glam for weddings, birthdays, photoshoots, and special occasions across London, Manchester, Birmingham, Leeds, Sheffield, and Bradford."}
          </p>

          <p className="mb-4 leading-relaxed text-[#2A2A2A]">
            {about?.travelNote ||
              "With expertise in bridal transformations and high-end glam, Suzain creates stunning looks that celebrate confidence, beauty, and your most memorable moments. She also teaches online classes for beginners, offers one-on-one upgrade sessions, and sells courses both online and in-person."}
          </p>

          <div className="mb-6 grid grid-cols-2 gap-6">
            <div className="border-l-2 border-black pl-4">
              <h4 className="text-2xl text-black">UK Cities</h4>
              <p className="text-sm text-[#666666]">London · Manchester · Birmingham</p>
              <p className="text-sm text-[#666666]">Leeds · Sheffield · Bradford</p>
            </div>
            <div className="border-l-2 border-black pl-4">
              <h4 className="text-2xl text-black">Training & Courses</h4>
              <ul className="space-y-2 text-sm text-[#2A2A2A]">
                {(Array.isArray(about?.training) ? about.training : [
                  "Online classes for beginners",
                  "One-on-one training and upgrade classes",
                  "Courses available online and physical",
                ]).map((t: string) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[#666666]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-black" />
              <span className="text-sm">Available to travel to any country</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-black" />
              <span className="text-sm">Limited slots</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/portfolio"
              className="inline-block rounded border-2 border-black bg-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] transition-all hover:bg-transparent hover:text-black"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
