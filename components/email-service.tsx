"use client"

// Email service utility functions
export const sendTestimonialEmail = async (testimonialData: {
  name: string
  role: string
  content: string
  rating: number
  email: string
}) => {
  try {
    // Using EmailJS service (free email service)
    const emailData = {
      to_email: "45clickers@gmail.com", // Updated email
      from_name: testimonialData.name,
      from_email: testimonialData.email,
      client_role: testimonialData.role,
      rating: testimonialData.rating,
      testimonial_content: testimonialData.content,
      submission_date: new Date().toLocaleString(),
    }

    // This would integrate with EmailJS or similar service
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    return response.ok
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

// Alternative: Using mailto (opens user's email client)
export const sendEmailViaMailto = (testimonialData: {
  name: string
  role: string
  content: string
  rating: number
  email: string
}) => {
  const subject = `New Testimonial Submission from ${testimonialData.name}`
  const body = `
New Testimonial Received!

Client Details:
- Name: ${testimonialData.name}
- Role/Company: ${testimonialData.role || "Not provided"}
- Email: ${testimonialData.email || "Not provided"}
- Rating: ${testimonialData.rating}/5 stars

Testimonial:
"${testimonialData.content}"

Submitted on: ${new Date().toLocaleString()}

---
This testimonial is pending your review in the admin panel.
`.trim()

  const mailtoLink = `mailto:45clickers@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(mailtoLink)
}
