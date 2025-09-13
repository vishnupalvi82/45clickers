"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface PerformanceContextType {
  isLowEndDevice: boolean
  prefersReducedMotion: boolean
  connectionSpeed: "slow" | "fast"
  deviceMemory: number
  shouldReduceAnimations: boolean
}

const PerformanceContext = createContext<PerformanceContextType>({
  isLowEndDevice: false,
  prefersReducedMotion: false,
  connectionSpeed: "fast",
  deviceMemory: 4,
  shouldReduceAnimations: false,
})

export const usePerformance = () => useContext(PerformanceContext)

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [performanceData, setPerformanceData] = useState<PerformanceContextType>({
    isLowEndDevice: false,
    prefersReducedMotion: false,
    connectionSpeed: "fast",
    deviceMemory: 4,
    shouldReduceAnimations: false,
  })

  useEffect(() => {
    const detectPerformance = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      // Detect low-end device
      const navigator = window.navigator as any
      const deviceMemory = navigator.deviceMemory || 4
      const hardwareConcurrency = navigator.hardwareConcurrency || 4

      // Consider device low-end if:
      // - Less than 2GB RAM
      // - Less than 4 CPU cores
      // - Mobile device with small screen
      const isLowEndDevice =
        deviceMemory < 2 || hardwareConcurrency < 4 || (window.innerWidth < 768 && deviceMemory < 4)

      // Check connection speed
      const connection = (navigator as any).connection
      const connectionSpeed = connection?.effectiveType === "4g" ? "fast" : "slow"

      const shouldReduceAnimations = prefersReducedMotion || isLowEndDevice || connectionSpeed === "slow"

      setPerformanceData({
        isLowEndDevice,
        prefersReducedMotion,
        connectionSpeed,
        deviceMemory,
        shouldReduceAnimations,
      })

      // Apply performance optimizations to document
      if (shouldReduceAnimations) {
        document.documentElement.classList.add("reduce-motion")
      }

      if (isLowEndDevice) {
        document.documentElement.classList.add("low-end-device")
      }
    }

    detectPerformance()

    // Listen for changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    mediaQuery.addEventListener("change", detectPerformance)

    return () => {
      mediaQuery.removeEventListener("change", detectPerformance)
    }
  }, [])

  return <PerformanceContext.Provider value={performanceData}>{children}</PerformanceContext.Provider>
}
