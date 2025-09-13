"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { usePerformance } from "./performance-provider"

type FloatingElement = {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
}

export default function OptimizedFloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([])
  const { isLowEndDevice, shouldReduceAnimations } = usePerformance()

  useEffect(() => {
    // Skip floating elements on low-end devices or if animations are reduced
    if (shouldReduceAnimations || isLowEndDevice) {
      return
    }

    const colors = ["bg-purple-500/10", "bg-blue-500/10", "bg-cyan-500/10"]
    const isMobile = window.innerWidth < 768
    const elementCount = isMobile ? 3 : 8 // Reduced count
    const maxSize = isMobile ? 40 : 60 // Smaller sizes

    const newElements = Array.from({ length: elementCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * maxSize + 20,
      duration: Math.random() * 40 + 30, // Slower animations
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setElements(newElements)
  }, [shouldReduceAnimations, isLowEndDevice])

  // Don't render anything if animations should be reduced
  if (shouldReduceAnimations || isLowEndDevice) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute rounded-full blur-2xl ${element.color}`}
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
            willChange: "transform", // GPU acceleration hint
          }}
          animate={{
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: element.duration,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            delay: element.delay,
          }}
        />
      ))}
    </div>
  )
}
