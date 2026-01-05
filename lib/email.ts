import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "beautyhomebysuzain@gmail.com" // Default fallback

export async function sendBookingNotification(booking: any) {
  if (!resend) {
    console.warn("Resend API Key not found. Skipping email notification.")
    return
  }

  const {
    reference,
    customer_name,
    customer_email,
    customer_phone,
    package_name,
    amount_paid,
    currency,
    appointment_date,
    time_window,
    city,
    notes,
  } = booking

  const amountLabel = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
  }).format(amount_paid / 100)

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #b1781d;">New Booking Received!</h1>
      <p><strong>Ref:</strong> ${reference}</p>
      
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #fdf7ef;">
        <h3 style="margin-top: 0;">Customer Details</h3>
        <p><strong>Name:</strong> ${customer_name}</p>
        <p><strong>Phone:</strong> ${customer_phone}</p>
        <p><strong>Email:</strong> ${customer_email || "N/A"}</p>
        
        <h3 style="margin-top: 20px;">Booking Details</h3>
        <p><strong>Package:</strong> ${package_name}</p>
        <p><strong>Date:</strong> ${appointment_date}</p>
        <p><strong>Time:</strong> ${time_window}</p>
        <p><strong>Location:</strong> ${city}</p>
        <p><strong>Amount Due:</strong> ${amountLabel}</p>
        
        ${notes ? `<p><strong>Notes:</strong><br>${notes}</p>` : ""}
      </div>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This booking is currently <strong>Pending Payment</strong>. Please check your bank account for a transfer with reference <strong>${reference}</strong>.
      </p>
    </div>
  `

  try {
    await resend.emails.send({
      from: "BeautyHomeBySuzain <bookings@beautyhomebysuzain.com>", // Update this once domain is verified in Resend
      to: ADMIN_EMAIL,
      subject: `New Booking: ${customer_name} (${appointment_date})`,
      html,
    })
    console.log(`Email notification sent for ${reference}`)
  } catch (error) {
    console.error("Failed to send email notification:", error)
  }
}
