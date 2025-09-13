"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialForm from "./testimonial-form"
import AdminTestimonials from "./admin-testimonials"

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const testimonialVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  email: string
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Batangadh News",
      role: "News Channel",
      content:
        "With 45 Clickers' editing, our news videos became more engaging. Their fast delivery and professional output made our workflow much smoother.",
      rating: 5,
      email: "contact@batangadhnews.com",
      status: "approved",
      submittedAt: new Date("2024-01-15"),
    },
    {
      id: 2,
      name: "FactFocus.in",
      role: "Instagram Fact-based Channel",
      content:
        "The reels editing is creative and impactful. They made our facts visually strong, which boosted both reach and engagement.",
      rating: 5,
      email: "team@factfocus.in",
      status: "approved",
      submittedAt: new Date("2024-01-20"),
    },
    {
      id: 3,
      name: "Mr. Cinematic",
      role: "YouTube Creator",
      content:
        "I needed high-quality edits for cinematic storytelling, and 45 Clickers delivered perfectly. Every frame looked clean and professional.",
      rating: 5,
      email: "hello@mrcinematic.com",
      status: "approved",
      submittedAt: new Date("2024-01-25"),
    },
    {
      id: 4,
      name: "AdGrow Media",
      role: "Digital Marketing Agency",
      content:
        "The videos are always perfectly optimized for our campaigns. Their editing style makes the brand message clear and attractive.",
      rating: 5,
      email: "projects@adgrowmedia.com",
      status: "approved",
      submittedAt: new Date("2024-02-01"),
    },
    {
      id: 5,
      name: "Gurukul International School",
      role: "Educational Institution",
      content:
        "They beautifully edited our school's promotional videos and reels. Both parents and students appreciated the presentation.",
      rating: 5,
      email: "admin@gurukulschool.edu",
      status: "approved",
      submittedAt: new Date("2024-02-10"),
    },
    {
      id: 6,
      name: "TrendHive Studios",
      role: "Content Production House",
      content:
        "The 45 Clickers team delivers on time and brings creative editing ideas. Working with them is always smooth and productive.",
      rating: 5,
      email: "collaborate@trendhivestudios.com",
      status: "approved",
      submittedAt: new Date("2024-02-15"),
    },
  ])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Only show approved testimonials to regular users
  const approvedTestimonials = allTestimonials.filter((t) => t.status === "approved")

  const nextSlide = () => {
    if (isAnimating || approvedTestimonials.length === 0) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % approvedTestimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating || approvedTestimonials.length === 0) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + approvedTestimonials.length) % approvedTestimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    if (approvedTestimonials.length > 1) {
      intervalRef.current = setInterval(nextSlide, 8000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [approvedTestimonials.length])

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      if (approvedTestimonials.length > 1) {
        intervalRef.current = setInterval(nextSlide, 8000)
      }
    }
  }

  const handleSubmitTestimonial = (testimonialData: {
    name: string
    role: string
    content: string
    rating: number
    email: string
  }) => {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      ...testimonialData,
      status: "pending",
      submittedAt: new Date(),
    }

    setAllTestimonials((prev) => [...prev, newTestimonial])
    setShowForm(false)
  }

  const handleApprove = (id: number) => {
    setAllTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t)))
  }

  const handleReject = (id: number) => {
    setAllTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, status: "rejected" } : t)))
  }

  // Admin access (you can add password protection here)
  const handleAdminAccess = () => {
    const password = prompt("Enter admin password:")
    if (password === "45clickers2024") {
      // Simple password protection
      setShowAdmin(true)
    } else {
      alert("Incorrect password!")
    }
  }

  return (
    <motion.section
      id="testimonials"
      className="py-20 relative"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-150px" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Client{" "}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Testimonials
              </span>
            </h2>

            {/* Admin Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdminAccess}
                className="border-gray-700 text-gray-400 hover:text-white bg-transparent"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl mx-auto">
            Hear what our clients have to say about our video editing services
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4"></div>
        </motion.div>

        {approvedTestimonials.length > 0 ? (
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -top-10 -left-10 text-purple-500/20">
              <Quote className="h-20 w-20" />
            </div>

            <div className="absolute -bottom-10 -right-10 text-blue-500/20 transform rotate-180">
              <Quote className="h-20 w-20" />
            </div>

            <motion.div
              variants={testimonialVariants}
              className="relative overflow-hidden rounded-xl bg-gray-900/50 border border-gray-800 p-8 md:p-12"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

              <div className="relative">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-lg md:text-xl text-gray-300 italic mb-8">
                    "{approvedTestimonials[currentIndex]?.content}"
                  </p>

                  <div className="flex items-center justify-center">
                    <div className="mr-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                        {approvedTestimonials[currentIndex]?.name.charAt(0)}
                      </div>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white">{approvedTestimonials[currentIndex]?.name}</h4>
                      <p className="text-gray-400">{approvedTestimonials[currentIndex]?.role}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {approvedTestimonials.length > 1 && (
              <div className="flex justify-center mt-8 gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    prevSlide()
                    resetInterval()
                  }}
                  className="border-gray-700 hover:bg-gray-800 text-white"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex gap-2 items-center">
                  {approvedTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index)
                        resetInterval()
                      }}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-700"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    nextSlide()
                    resetInterval()
                  }}
                  className="border-gray-700 hover:bg-gray-800 text-white"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No testimonials available yet.</p>
          </div>
        )}

        {/* Add Testimonial Button */}
        <div className="text-center mt-12">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {showForm ? "Cancel" : "Share Your Experience"}
          </Button>
        </div>

        {/* Testimonial Form */}
        {showForm && (
          <div className="mt-8 max-w-2xl mx-auto">
            <TestimonialForm onSubmit={handleSubmitTestimonial} />
          </div>
        )}

        {/* Admin Panel */}
        <AdminTestimonials
          testimonials={allTestimonials}
          onApprove={handleApprove}
          onReject={handleReject}
          isVisible={showAdmin}
          onToggleVisibility={() => setShowAdmin(false)}
        />
      </div>
    </motion.section>
  )
}
