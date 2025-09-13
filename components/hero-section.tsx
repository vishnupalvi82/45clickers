"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"
import OptimizedVideo from "./optimized-video"
import { usePerformance } from "./performance-provider"

export default function HeroSection() {
  const videoRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { shouldReduceAnimations, isLowEndDevice } = usePerformance()

  useEffect(() => {
    setIsMounted(true)

    if (shouldReduceAnimations || isLowEndDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return

      const { left, top, width, height } = videoRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      videoRef.current.style.transform = `perspective(1000px) rotateY(${x * 1}deg) rotateX(${-y * 1}deg)`
    }

    const handleMouseLeave = () => {
      if (!videoRef.current) return
      videoRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)"
    }

    const element = videoRef.current
    if (element) {
      element.addEventListener("mousemove", handleMouseMove, { passive: true })
      element.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove)
        element.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [shouldReduceAnimations, isLowEndDevice])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceAnimations ? 0.1 : 0.3,
        delayChildren: shouldReduceAnimations ? 0.1 : 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: shouldReduceAnimations ? 10 : 30, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceAnimations ? 0.3 : 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const videoVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceAnimations ? 0.3 : 1,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: shouldReduceAnimations ? 0.2 : 0.4,
      },
    },
  }

  if (!isMounted) {
    return (
      <section className="relative min-h-screen pt-24 pb-16 flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Let's Take Editing to the{" "}
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Next Level
                </span>
              </h1>
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto lg:mx-0" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
            <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Let's Take Editing to the{" "}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Next Level
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-xl md:text-2xl text-gray-300 mb-8">
              With{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Powerful Visuals</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-purple-500/30 -z-10"></span>
              </span>{" "}
              and{" "}
              <span className="relative inline-block">
                <span className="relative z-10">AI Precision</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-500/30 -z-10"></span>
              </span>
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="https://www.youtube.com/@45_clickers" target="_blank" rel="noopener noreferrer">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-6"
                  size="lg"
                >
                  Explore Our Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>

              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800 font-medium px-6 py-6 bg-transparent"
                size="lg"
              >
                Download Portfolio
                <Download className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            ref={videoRef}
            variants={videoVariant}
            initial="hidden"
            animate="show"
            className="relative transition-transform duration-300 ease-out"
            style={{
              transformStyle: "preserve-3d",
              willChange: shouldReduceAnimations ? "auto" : "transform",
            }}
          >
            <div className="relative overflow-hidden rounded-xl shadow-2xl border border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 z-20 pointer-events-none"></div>

              {/* Video Player */}
              <div className="aspect-video">
                <OptimizedVideo
                  videoId="csH4dpVPWWA"
                  title="45Clickers Showreel"
                  className="w-full h-full"
                  autoplay={!isLowEndDevice}
                />
              </div>

              {/* Showreel Label */}
              <div className="absolute top-4 left-4 z-30">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                  SHOWREEL
                </span>
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none"></div>
            </div>

            {/* Decorative elements - only on high-end devices */}
            {!shouldReduceAnimations && (
              <>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/4 -right-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 -left-6 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -right-12 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
