'use client'

import Image from "next/image"
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
    <section className="bg-[#0E0E0E] px-4 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-lg bg-[#C9A24D]/20" />
          <div className="relative h-[500px] w-full">
            <Image
              src={withSite(about?.image || "/assets/IMG-20251227-WA0028.jpg")}
              alt={about?.imageAlt || "Susan Eworo - Makeup Artist"}
              fill
              className="rounded-lg object-cover shadow-2xl"
              style={{ objectPosition: "center 15%" }}
            />
          </div>
        </div>

        <div>
          <p className="section-eyebrow mb-4 text-sm text-[#b1781d]">About BeautyHomeBySuzain</p>
          <h2 className="font-display text-4xl text-[#b1781d] md:text-5xl">
            {about?.title || "Susan Eworo (Suzain)"}
          </h2>
          <div className="my-6 h-1 w-20 bg-[#C9A24D]" />

          <p className="mb-6 leading-relaxed text-[#4a3320]">
            {about?.bio ||
              "BeautyHomeBySuzain is a luxury makeup brand led by Susan Eworo, a celebrity and bridal makeup artist delivering flawless glam for weddings, birthdays, photoshoots, and special occasions across London, Manchester, Birmingham, Leeds, Sheffield, and Bradford."}
          </p>

          <p className="mb-4 leading-relaxed text-[#4a3320]">
            {about?.travelNote ||
              "With expertise in bridal transformations and high-end glam, Suzain creates stunning looks that celebrate confidence, beauty, and your most memorable moments. She also teaches online classes for beginners, offers one-on-one upgrade sessions, and sells courses both online and in-person."}
          </p>

          <div className="mb-6 grid grid-cols-2 gap-6">
            <div className="border-l-2 border-[#C9A24D] pl-4">
              <h4 className="text-2xl text-[#C9A24D]">UK Cities</h4>
              <p className="text-sm text-[#8c6235]">London · Manchester · Birmingham</p>
              <p className="text-sm text-[#8c6235]">Leeds · Sheffield · Bradford</p>
            </div>
            <div className="border-l-2 border-[#C9A24D] pl-4">
              <h4 className="text-2xl text-[#C9A24D]">Training & Courses</h4>
              <ul className="space-y-2 text-sm text-[#4a3320]">
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

          <div className="flex flex-wrap items-center gap-4 text-[#E6D1C3]/80">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C9A24D]" />
              <span className="text-sm">Available to travel to any country</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C9A24D]" />
              <span className="text-sm">Limited slots</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
