"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePerformance } from "./performance-provider"

interface OptimizedVideoProps {
  videoId: string
  title: string
  className?: string
  showControls?: boolean
  autoplay?: boolean
  thumbnail?: string
}

export default function OptimizedVideo({
  videoId,
  title,
  className = "",
  showControls = true,
  autoplay = false,
  thumbnail,
}: OptimizedVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)
  const { isLowEndDevice, shouldReduceAnimations } = usePerformance()

  // Generate thumbnail URL
  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)

        // Auto-load video only on high-end devices and when in view
        if (entry.isIntersecting && !isLowEndDevice && autoplay) {
          setIsLoaded(true)
        }
      },
      {
        rootMargin: isLowEndDevice ? "0px" : "50px",
        threshold: 0.1,
      },
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [isLowEndDevice, autoplay])

  const handlePlayClick = () => {
    setIsLoaded(true)
    setIsPlaying(true)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const openInYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")
  }

  return (
    <div
      ref={videoRef}
      className={`relative w-full h-full group ${className}`}
      onMouseEnter={() => !isLowEndDevice && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isLoaded ? (
        // Thumbnail with play button
        <div className="relative w-full h-full">
          <img
            src={thumbnailUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
            onError={(e) => {
              // Fallback to default thumbnail
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 rounded-lg" />

          {/* Play button */}
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center group/play hover:scale-105 transition-transform duration-200"
            aria-label={`Play ${title}`}
          >
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover/play:bg-red-700 transition-colors">
              <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
            </div>
          </button>

          {/* Video title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
            <h3 className="text-white font-medium text-sm">{title}</h3>
          </div>
        </div>
      ) : (
        // Actual video iframe
        <div className="relative w-full h-full">
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />

          {/* Controls Overlay */}
          {showControls && (
            <div
              className={`absolute bottom-4 right-4 flex gap-2 z-10 transition-opacity duration-300 ${
                isHovered || isLowEndDevice ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                className="bg-black/60 border-gray-600 hover:bg-black/80 text-white backdrop-blur-sm"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={openInYouTube}
                className="bg-black/60 border-gray-600 hover:bg-black/80 text-white backdrop-blur-sm"
                aria-label="Open in YouTube"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
