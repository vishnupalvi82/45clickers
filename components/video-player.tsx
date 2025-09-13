"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  videoId: string
  className?: string
}

export default function VideoPlayer({ videoId, className = "" }: VideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Create player when API is ready
    ;(window as any).onYouTubeIframeAPIReady = () => {
      setIsLoaded(true)
    }
  }, [])

  const toggleMute = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const message = isMuted
        ? '{"event":"command","func":"unMute","args":""}'
        : '{"event":"command","func":"mute","args":""}'
      iframe.contentWindow?.postMessage(message, "*")
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <iframe
        ref={iframeRef}
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
        title="45Clickers Showreel"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Custom Mute/Unmute Button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="bg-black/60 border-gray-600 hover:bg-black/80 text-white backdrop-blur-sm"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay to prevent right-click and other interactions */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  )
}
