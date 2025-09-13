"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { usePerformance } from "./performance-provider"

export default function OptimizedPageTransitions() {
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const { shouldReduceAnimations, isLowEndDevice } = usePerformance()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const y1 = useTransform(smoothProgress, [0, 1], [0, shouldReduceAnimations ? -20 : -50])
  const opacity1 = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.5, 0])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || shouldReduceAnimations) {
    return (
      <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-5">
        {/* Static scroll indicator */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-5">
      {/* Minimal parallax elements */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute top-20 left-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"
      />
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute bottom-40 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"
      />

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />
    </div>
  )
}
