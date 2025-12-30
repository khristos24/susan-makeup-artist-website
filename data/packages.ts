export type Currency = "GBP" | "NGN"
export type Availability = "UK" | "NG" | "BOTH"

export type PackageData = {
  id: string
  name: string
  description: string
  currency: Currency
  price: number // major units (e.g., 350.99 or 65000)
  deposit: number // major units
  includes: string[]
  durationEstimate: string
  availability: Availability
}

export const packages: PackageData[] = [
  {
    id: "bridal-package",
    name: "Bridal Package",
    description: "The ultimate all-in-one bridal experience designed to make you look and feel flawless on your wedding day.",
    currency: "GBP",
    price: 350.99,
    deposit: 120,
    includes: [
      "Bridal trial session tailored to your look and theme",
      "Premium skin prep and luxury finish",
      "3-4 hour full glam session",
      "Professional touch-ups throughout the day",
      "Two edited videos ideal for reels or wedding memories",
    ],
    durationEstimate: "3-4 hours (wedding day)",
    availability: "BOTH",
  },
  {
    id: "birthday-glam",
    name: "Birthday Glam Package",
    description: "Celebrate your special day with a luxury beauty and photography experience.",
    currency: "NGN",
    price: 65000,
    deposit: 15000,
    includes: [
      "Flawless makeup application",
      "Premium skin prep and lash styling",
      "Birthday photoshoot included",
      "High-quality edited photos",
      "Non-refundable booking fee applies",
    ],
    durationEstimate: "2-3 hours",
    availability: "BOTH",
  },
  {
    id: "exclusive-birthday-shoot",
    name: "Exclusive Birthday Shoot",
    description: "Makeup photography session with cinematic video and professional editing.",
    currency: "NGN",
    price: 60000,
    deposit: 15000,
    includes: [
      "30-second reel included",
      "1-2 outfit changes for variety",
      "High-definition makeup finish",
      "Five professionally edited photos",
      "Cinematic reel for social media",
    ],
    durationEstimate: "2-3 hours",
    availability: "BOTH",
  },
]

export function formatPrice(pkg: PackageData) {
  const value = pkg.price
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: pkg.currency,
    minimumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
    maximumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
  })
  return formatter.format(value)
}

export function formatDeposit(pkg: PackageData) {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: pkg.currency,
    minimumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
    maximumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
  })
  return formatter.format(pkg.deposit)
}
