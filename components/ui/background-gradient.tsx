"use client"

import { useEffect, useRef } from "react"

export function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Detect mobile device
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // Use static gradient for mobile
      const staticGradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8,
      )
      staticGradient.addColorStop(0, "rgba(123, 31, 162, 0.3)")
      staticGradient.addColorStop(0.5, "rgba(32, 156, 238, 0.2)")
      staticGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = staticGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      return
    }

    let animationFrameId: number
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
    }

    window.addEventListener("mousemove", handleMouseMove)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const gradient1 = ctx.createRadialGradient(
      canvas.width * 0.3,
      canvas.height * 0.3,
      0,
      canvas.width * 0.3,
      canvas.height * 0.3,
      canvas.width * 0.8,
    )

    gradient1.addColorStop(0, "rgba(123, 31, 162, 0.5)")
    gradient1.addColorStop(1, "rgba(123, 31, 162, 0)")

    const gradient2 = ctx.createRadialGradient(
      canvas.width * 0.7,
      canvas.height * 0.7,
      0,
      canvas.width * 0.7,
      canvas.height * 0.7,
      canvas.width * 0.8,
    )

    gradient2.addColorStop(0, "rgba(32, 156, 238, 0.5)")
    gradient2.addColorStop(1, "rgba(32, 156, 238, 0)")

    let time = 0

    const animate = () => {
      time += 0.005

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update gradient positions based on mouse
      const grad1X = canvas.width * (0.3 + mouseX * 0.1 * Math.sin(time))
      const grad1Y = canvas.height * (0.3 + mouseY * 0.1 * Math.cos(time))

      const grad2X = canvas.width * (0.7 + mouseX * 0.1 * Math.cos(time))
      const grad2Y = canvas.height * (0.7 + mouseY * 0.1 * Math.sin(time))

      const gradient1 = ctx.createRadialGradient(grad1X, grad1Y, 0, grad1X, grad1Y, canvas.width * 0.8)

      gradient1.addColorStop(0, "rgba(123, 31, 162, 0.5)")
      gradient1.addColorStop(1, "rgba(123, 31, 162, 0)")

      const gradient2 = ctx.createRadialGradient(grad2X, grad2Y, 0, grad2X, grad2Y, canvas.width * 0.8)

      gradient2.addColorStop(0, "rgba(32, 156, 238, 0.5)")
      gradient2.addColorStop(1, "rgba(32, 156, 238, 0)")

      // Draw gradients
      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Skip noise effect on mobile for better performance
      if (!isMobile) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const noise = Math.random() * 5 - 2.5
          data[i] = Math.max(0, Math.min(255, data[i] + noise))
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
        }

        ctx.putImageData(imageData, 0, 0)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-60" />
}
