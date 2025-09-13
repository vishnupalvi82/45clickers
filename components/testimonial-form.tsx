"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Star, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendEmailViaMailto } from "./email-service"

interface TestimonialFormProps {
  onSubmit: (testimonial: {
    name: string
    role: string
    content: string
    rating: number
    email: string
  }) => void
}

export default function TestimonialForm({ onSubmit }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [submissionTime, setSubmissionTime] = useState<number>(0)
  const [lastSubmission, setLastSubmission] = useState<number>(0)

  useEffect(() => {
    setSubmissionTime(Date.now())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Spam protection checks
    if (honeypot !== "") {
      console.log("Spam detected: honeypot filled")
      setIsSubmitting(false)
      return
    }

    const timeSpent = Date.now() - submissionTime
    if (timeSpent < 3000) {
      // Must spend at least 3 seconds on form
      alert("Please take your time to fill out the form properly.")
      setIsSubmitting(false)
      return
    }

    // Rate limiting - prevent multiple submissions
    const now = Date.now()
    if (now - lastSubmission < 60000) {
      // 1 minute cooldown
      alert("Please wait before submitting another testimonial.")
      setIsSubmitting(false)
      return
    }
    setLastSubmission(now)

    try {
      // Submit testimonial to local state
      onSubmit(formData)

      // Send email notification
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to_email: "45clickers@gmail.com", // Updated email
            from_name: formData.name,
            from_email: formData.email,
            client_role: formData.role,
            rating: formData.rating,
            testimonial_content: formData.content,
            submission_date: new Date().toLocaleString(),
            timestamp: Date.now(), // Add timestamp for security
          }),
        })

        if (response.ok) {
          setEmailSent(true)
        } else {
          // Fallback to mailto
          sendEmailViaMailto(formData)
          setEmailSent(true)
        }
      } catch (emailError) {
        // Fallback to mailto if API fails
        sendEmailViaMailto(formData)
        setEmailSent(true)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setEmailSent(false)
      setFormData({
        name: "",
        role: "",
        content: "",
        rating: 5,
        email: "",
      })
    }, 5000)
  }

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating })
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-green-900/20 border border-green-800 rounded-xl"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-green-400 mb-2">Thank You!</h3>
        <p className="text-green-300 mb-3">Your testimonial has been sent directly to 45clickers@gmail.com</p>
        <p className="text-green-200 text-sm mt-2">We'll review your feedback and may feature it on our website!</p>

        {emailSent && (
          <div className="flex items-center justify-center gap-2 text-blue-300 text-sm">
            <Mail className="h-4 w-4" />
            <span>Email notification sent to 45Clickers team</span>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Share Your Experience</h3>
        <p className="text-gray-400 text-sm">Help others by sharing your experience with 45Clickers</p>
        <p className="text-blue-400 text-xs mt-1">📧 We'll receive an instant email notification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Role/Company</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Content Creator, CEO at Company"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email (Optional)</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="your@email.com"
        />
      </div>

      {/* Honeypot field - hidden from users */}
      <div style={{ display: "none" }}>
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className={`p-1 transition-colors ${star <= formData.rating ? "text-yellow-400" : "text-gray-600"}`}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Your Testimonial *</label>
        <textarea
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Share your experience working with 45Clickers..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
      >
        {isSubmitting ? "Submitting..." : "Submit Testimonial"}
        <Send className="ml-2 h-4 w-4" />
      </Button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          📧 An email notification will be sent to the 45Clickers team upon submission
        </p>
      </div>
    </motion.form>
  )
}
