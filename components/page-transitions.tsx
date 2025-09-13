"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

export default function PageTransitions() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Create parallax layers
  const y1 = useTransform(smoothProgress, [0, 1], [0, -100])
  const y2 = useTransform(smoothProgress, [0, 1], [0, -200])
  const y3 = useTransform(smoothProgress, [0, 1], [0, -300])

  // Opacity transforms for fade effects
  const opacity1 = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.2, 0])
  const opacity2 = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-5">
      {/* Parallax background elements */}
      <motion.div
        style={isMobile ? {} : { y: y1, opacity: opacity1 }}
        className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"
      />
      <motion.div
        style={isMobile ? {} : { y: y2, opacity: opacity2 }}
        className="absolute top-40 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
      />
      <motion.div
        style={isMobile ? {} : { y: y3, opacity: opacity1 }}
        className="absolute bottom-40 left-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
      />

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />
    </div>
  )
}
