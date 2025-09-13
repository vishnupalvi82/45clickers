"use client"

import { useEffect, useRef } from "react"
import { usePerformance } from "./performance-provider"

export function OptimizedBackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isLowEndDevice, shouldReduceAnimations } = usePerformance()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Use static gradient for low-end devices
    if (isLowEndDevice || shouldReduceAnimations) {
      const staticGradient = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.3,
        0,
        canvas.width * 0.3,
        canvas.height * 0.3,
        canvas.width * 0.8,
      )
      staticGradient.addColorStop(0, "rgba(123, 31, 162, 0.2)")
      staticGradient.addColorStop(1, "rgba(123, 31, 162, 0)")

      const staticGradient2 = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.7,
        0,
        canvas.width * 0.7,
        canvas.height * 0.7,
        canvas.width * 0.8,
      )
      staticGradient2.addColorStop(0, "rgba(32, 156, 238, 0.2)")
      staticGradient2.addColorStop(1, "rgba(32, 156, 238, 0)")

      ctx.fillStyle = staticGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = staticGradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      return () => {
        window.removeEventListener("resize", resizeCanvas)
      }
    }

    // Animated gradient for high-end devices
    let animationFrameId: number
    let mouseX = 0.5
    let mouseY = 0.5
    let time = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    const animate = () => {
      time += 0.003 // Slower animation

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Simplified gradient animation
      const grad1X = canvas.width * (0.3 + mouseX * 0.05 * Math.sin(time))
      const grad1Y = canvas.height * (0.3 + mouseY * 0.05 * Math.cos(time))

      const grad2X = canvas.width * (0.7 + mouseX * 0.05 * Math.cos(time))
      const grad2Y = canvas.height * (0.7 + mouseY * 0.05 * Math.sin(time))

      const gradient1 = ctx.createRadialGradient(grad1X, grad1Y, 0, grad1X, grad1Y, canvas.width * 0.6)
      gradient1.addColorStop(0, "rgba(123, 31, 162, 0.3)")
      gradient1.addColorStop(1, "rgba(123, 31, 162, 0)")

      const gradient2 = ctx.createRadialGradient(grad2X, grad2Y, 0, grad2X, grad2Y, canvas.width * 0.6)
      gradient2.addColorStop(0, "rgba(32, 156, 238, 0.3)")
      gradient2.addColorStop(1, "rgba(32, 156, 238, 0)")

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isLowEndDevice, shouldReduceAnimations])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-40"
      style={{ willChange: "auto" }}
    />
  )
}
