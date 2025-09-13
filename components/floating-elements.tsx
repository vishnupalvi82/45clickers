"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type FloatingElement = {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
}

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    const colors = ["bg-purple-500/20", "bg-blue-500/20", "bg-cyan-500/20", "bg-indigo-500/20"]

    // Detect mobile device
    const isMobile = window.innerWidth < 768
    const elementCount = isMobile ? 6 : 15
    const maxSize = isMobile ? 60 : 100

    const newElements = Array.from({ length: elementCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * maxSize + 30,
      duration: Math.random() * 30 + 20, // Slower animations
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute rounded-full blur-3xl ${element.color}`}
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={
            window.innerWidth >= 768
              ? {
                  x: [
                    Math.random() * 50 - 25,
                    Math.random() * 50 - 25,
                    Math.random() * 50 - 25,
                    Math.random() * 50 - 25,
                  ],
                  y: [
                    Math.random() * 50 - 25,
                    Math.random() * 50 - 25,
                    Math.random() * 50 - 25,
                    Math.random() * 50 - 25,
                  ],
                  scale: [1, 1.05, 0.95, 1],
                }
              : {
                  x: [0, Math.random() * 20 - 10, 0],
                  y: [0, Math.random() * 20 - 10, 0],
                  scale: [1, 1.02, 1],
                }
          }
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
