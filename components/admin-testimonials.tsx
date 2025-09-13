"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Star, User, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface AdminTestimonialsProps {
  testimonials: Testimonial[]
  onApprove: (id: number) => void
  onReject: (id: number) => void
  isVisible: boolean
  onToggleVisibility: () => void
}

export default function AdminTestimonials({
  testimonials,
  onApprove,
  onReject,
  isVisible,
  onToggleVisibility,
}: AdminTestimonialsProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const filteredTestimonials = testimonials.filter((t) => (filter === "all" ? true : t.status === filter))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400 bg-green-900/20 border-green-800"
      case "rejected":
        return "text-red-400 bg-red-900/20 border-red-800"
      default:
        return "text-yellow-400 bg-yellow-900/20 border-yellow-800"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Admin - Testimonial Management</h2>
            <Button variant="outline" onClick={onToggleVisibility} className="border-gray-700 bg-transparent">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status as any)}
                className={
                  filter === status ? "bg-gradient-to-r from-purple-600 to-blue-600" : "border-gray-700 text-gray-300"
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-1 text-xs">
                  ({status === "all" ? testimonials.length : testimonials.filter((t) => t.status === status).length})
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <AnimatePresence>
            {filteredTestimonials.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No testimonials found for this filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTestimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{testimonial.name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(testimonial.status)}`}
                          >
                            {testimonial.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          {testimonial.role && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {testimonial.role}
                            </div>
                          )}
                          {testimonial.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {testimonial.email}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(testimonial.submittedAt)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-400 ml-2">({testimonial.rating}/5)</span>
                        </div>

                        <p className="text-gray-300 italic">"{testimonial.content}"</p>
                      </div>

                      {testimonial.status === "pending" && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => onApprove(testimonial.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject(testimonial.id)}
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
