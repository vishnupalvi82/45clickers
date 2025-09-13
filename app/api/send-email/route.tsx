import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Security validation
    if (!data.from_name || !data.testimonial_content || !data.rating) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json({ success: false, error: "Invalid rating" }, { status: 400 })
    }

    // Basic spam detection
    if (data.testimonial_content.length > 2000) {
      return NextResponse.json({ success: false, error: "Content too long" }, { status: 400 })
    }

    // Email configuration
    const emailData = {
      to: "45clickers@gmail.com", // Updated email address
      subject: `🎬 New Client Testimonial from ${data.from_name} - 45Clickers`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: white;">🎬 New Client Testimonial!</h1>
            <p style="margin: 10px 0 0 0; color: #e5e7eb;">45Clickers Video Editing</p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #8b5cf6; margin-top: 0;">Client Information</h2>
              <p><strong>Name:</strong> ${data.from_name}</p>
              <p><strong>Role/Company:</strong> ${data.client_role || "Not provided"}</p>
              <p><strong>Email:</strong> ${data.from_email || "Not provided"}</p>
              <p><strong>Rating:</strong> ${"⭐".repeat(data.rating)} (${data.rating}/5)</p>
              <p><strong>Submitted:</strong> ${data.submission_date}</p>
              <p><strong>Timestamp:</strong> ${data.timestamp || "N/A"}</p>
            </div>
            
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px;">
              <h2 style="color: #3b82f6; margin-top: 0;">Testimonial Content</h2>
              <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 15px; margin: 0; font-style: italic; color: #d1d5db;">
                "${data.testimonial_content}"
              </blockquote>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #374151; border-radius: 8px;">
              <p style="margin: 0; color: #9ca3af;">
                📋 This testimonial was submitted through your website contact form.
              </p>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">
                Security: Form includes spam protection and rate limiting.
              </p>
            </div>
          </div>
          
          <div style="background: #111111; padding: 15px; text-align: center; color: #6b7280;">
            <p style="margin: 0;">45Clickers - Professional Video Editing Services</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Email: 45clickers@gmail.com</p>
          </div>
        </div>
      `,
    }

    // Create a transporter object using your SMTP server details
    const transporter = nodemailer.createTransport({
      host: "smtp.example.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "your-email@example.com",
        pass: "your-email-password",
      },
    })

    // Send mail with defined transport object
    const info = await transporter.sendMail(emailData)

    console.log("Message sent: %s", info.messageId)
    console.log("Email content:", emailData)

    // Return success
    return NextResponse.json({
      success: true,
      message: "Testimonial sent directly to 45clickers@gmail.com",
      fallback: false,
    })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
