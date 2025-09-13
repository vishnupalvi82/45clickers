"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Volume2, VolumeX, X, ExternalLink, Grid, Layers, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePerformance } from "./performance-provider"

interface Video {
  id: number
  title: string
  videoId: string
  type: "short" | "long"
  category: string
  duration?: string
  thumbnail?: string
  driveUrl?: string
}

interface VideoPlayerModalProps {
  video: Video | null
  isOpen: boolean
  onClose: () => void
}

// Google Drive helper functions
function extractDriveFileId(url: string): string {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : ""
}

function getDriveThumbnail(driveUrl: string): string {
  const fileId = extractDriveFileId(driveUrl)
  return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h711` : ""
}

function getDriveEmbedUrl(driveUrl: string): string {
  const fileId = extractDriveFileId(driveUrl)
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : ""
}

// Modal Video Player Component for Long Videos
function VideoPlayerModal({ video, isOpen, onClose }: VideoPlayerModalProps) {
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!video || !isOpen) return null

  const toggleMute = () => setIsMuted(!isMuted)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="bg-black/60 border-gray-600 hover:bg-black/80 text-white backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank")}
              className="bg-black/60 border-gray-600 hover:bg-black/80 text-white backdrop-blur-sm"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="bg-black/60 border-gray-600 hover:bg-black/80 text-white backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-bold text-xl mb-2">{video.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>{video.category}</span>
              {video.duration && <span>{video.duration}</span>}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Video Card Component (Works for both short and long videos)
function VideoCard({ video, isVisible, index }: { video: Video; isVisible: boolean; index: number }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { shouldReduceAnimations } = usePerformance()

  // Check if it's a Google Drive video
  const isDriveVideo = video.driveUrl && video.driveUrl.includes("drive.google.com")

  // Generate appropriate thumbnail and embed URLs
  const thumbnailUrl = isDriveVideo
    ? getDriveThumbnail(video.driveUrl!)
    : video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`

  const embedUrl = isDriveVideo
    ? getDriveEmbedUrl(video.driveUrl!)
    : `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${video.videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`

  const isShort = video.type === "short"

  const handlePlayClick = () => {
    if (isVisible) {
      setIsLoaded(true)
      setIsPlaying(true)
    }
  }

  const handleCloseVideo = () => {
    setIsPlaying(false)
    setIsLoaded(false)
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const openExternal = () => {
    if (isDriveVideo) {
      window.open(video.driveUrl, "_blank")
    } else {
      window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceAnimations ? 0.2 : 0.6,
        delay: shouldReduceAnimations ? 0 : index * 0.05,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={
        shouldReduceAnimations
          ? {}
          : {
              y: -4,
              scale: 1.02,
              transition: { duration: 0.2 },
            }
      }
      className={`group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl ${
        isShort ? "aspect-[9/16]" : "aspect-video"
      }`}
      onMouseEnter={() => !shouldReduceAnimations && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isLoaded || !isPlaying ? (
        // Thumbnail View
        <div className="relative w-full h-full">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <img
            src={isVisible ? thumbnailUrl : "/placeholder.svg"}
            alt={video.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${shouldReduceAnimations ? "" : "group-hover:scale-105"}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              if (isVisible) {
                if (isDriveVideo) {
                  e.currentTarget.src = "/placeholder.svg?height=711&width=400&text=Video+Preview"
                } else {
                  e.currentTarget.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                }
                setImageLoaded(true)
              }
            }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Play button */}
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center group/play"
            aria-label={`Play ${video.title}`}
          >
            <div
              className={`${
                isShort ? "w-12 h-12" : "w-16 h-16"
              } bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                shouldReduceAnimations ? "" : "group-hover/play:bg-white group-hover/play:scale-110"
              }`}
            >
              <Play className={`${isShort ? "h-4 w-4" : "h-6 w-6"} text-black ml-0.5`} fill="currentColor" />
            </div>
          </button>

          {/* Video type indicator */}
          <div className={`absolute ${isShort ? "top-2 right-2" : "top-3 right-3"}`}>
            <span
              className={`${
                isShort ? "bg-pink-600" : "bg-blue-600"
              } text-white text-xs px-2 py-1 rounded-full font-medium`}
            >
              {isShort ? "REEL" : "VIDEO"}
            </span>
          </div>

          {/* Duration for long videos */}
          {!isShort && video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {video.duration}
            </div>
          )}

          {/* Video info */}
          <div
            className={`absolute bottom-0 left-0 right-0 ${isShort ? "p-3" : "p-4"} bg-gradient-to-t from-black/80 to-transparent`}
          >
            <h3 className={`text-white font-bold ${isShort ? "text-xs" : "text-sm"} mb-1 line-clamp-2`}>
              {video.title}
            </h3>
            <p className={`text-gray-300 ${isShort ? "text-xs" : "text-xs"}`}>{video.category}</p>
          </div>
        </div>
      ) : (
        // Video Player
        <div className="relative w-full h-full">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Video Controls */}
          <div className={`absolute ${isShort ? "bottom-2 right-2" : "bottom-3 right-3"} flex gap-1`}>
            {!isDriveVideo && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                className={`${
                  isShort ? "w-7 h-7" : "w-8 h-8"
                } bg-black/60 border-gray-600 hover:bg-black/80 text-white backdrop-blur-sm`}
              >
                {isMuted ? (
                  <VolumeX className={`${isShort ? "h-3 w-3" : "h-4 w-4"}`} />
                ) : (
                  <Volume2 className={`${isShort ? "h-3 w-3" : "h-4 w-4"}`} />
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={openExternal}
              className={`${
                isShort ? "w-7 h-7" : "w-8 h-8"
              } bg-black/60 border-gray-600 hover:bg-black/80 text-white backdrop-blur-sm`}
            >
              <ExternalLink className={`${isShort ? "h-3 w-3" : "h-4 w-4"}`} />
            </Button>
          </div>

          {/* Close button */}
          <button
            onClick={handleCloseVideo}
            className={`absolute ${isShort ? "top-2 left-2 w-7 h-7" : "top-3 left-3 w-8 h-8"} bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors backdrop-blur-sm`}
          >
            <X className={`${isShort ? "h-3 w-3" : "h-4 w-4"}`} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

// Main Component
export default function WorkShowcase() {
  const [activeTab, setActiveTab] = useState<"shorts" | "long">("shorts")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showAllShorts, setShowAllShorts] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const videos: Video[] = [
    // Short Videos (9:16) - REELS ONLY for Work Showcase
    // Voice Over Category (2 videos for initial display)
    {
      id: 1,
      title: "Professional Voice Over Demo 1",
      videoId: "1wUbUSXSBwwoxR1w6i4NeyJbC5Gr6sj1J",
      type: "short",
      category: "Voice Over",
      driveUrl: "https://drive.google.com/file/d/1wUbUSXSBwwoxR1w6i4NeyJbC5Gr6sj1J/view?usp=drive_link",
    },
    {
      id: 2,
      title: "Professional Voice Over Demo 2",
      videoId: "1cS8HdH6RWqftOw1LX-u2orhu7dXEHn5-",
      type: "short",
      category: "Voice Over",
      driveUrl: "https://drive.google.com/file/d/1cS8HdH6RWqftOw1LX-u2orhu7dXEHn5-/view?usp=drive_link",
    },
    // Podcast Category (2 videos for initial display)
    {
      id: 3,
      title: "Podcast Reel Highlight 1",
      videoId: "118kNHDAZINcEG4YpteUPY79EGGWR-WL8",
      type: "short",
      category: "Podcast",
      driveUrl: "https://drive.google.com/file/d/118kNHDAZINcEG4YpteUPY79EGGWR-WL8/view?usp=drive_link",
    },
    {
      id: 4,
      title: "Podcast Reel Highlight 2",
      videoId: "13jNEpKjAJbAZVB7mG8EEX-9JmY1UmCLj",
      type: "short",
      category: "Podcast",
      driveUrl: "https://drive.google.com/file/d/13jNEpKjAJbAZVB7mG8EEX-9JmY1UmCLj/view?usp=drive_link",
    },
    // Explainer Category (2 videos for initial display)
    {
      id: 5,
      title: "Explainer & Awareness Short 1",
      videoId: "13jNEpKjAJbAZVB7mG8EEX-9JmY1UmCLj",
      type: "short",
      category: "Explainer",
      driveUrl: "https://drive.google.com/file/d/13jNEpKjAJbAZVB7mG8EEX-9JmY1UmCLj/view?usp=drive_link",
    },
    {
      id: 6,
      title: "Explainer & Awareness Short 2",
      videoId: "1S3lV--O8vcH7hvWu6yl-jFZukG-g4HcD",
      type: "short",
      category: "Explainer",
      driveUrl: "https://drive.google.com/file/d/1S3lV--O8vcH7hvWu6yl-jFZukG-g4HcD/view?usp=drive_link",
    },
    // Motion Graphics Category (2 videos for initial display)
    {
      id: 7,
      title: "Motion Graphics Showcase 1",
      videoId: "1BQMbX5xiB-fsQoJ2RA2bUkgK0yVn1FJh",
      type: "short",
      category: "Motion Graphics",
      driveUrl: "https://drive.google.com/file/d/1BQMbX5xiB-fsQoJ2RA2bUkgK0yVn1FJh/view?usp=drive_link",
    },
    {
      id: 8,
      title: "Motion Graphics Showcase 2",
      videoId: "1YI4OeqvxnotKqd4cevmLTHQMgqxhjrxb",
      type: "short",
      category: "Motion Graphics",
      driveUrl: "https://drive.google.com/file/d/1YI4OeqvxnotKqd4cevmLTHQMgqxhjrxb/view?usp=drive_link",
    },

    // Additional REELS (shown only when "View All" is clicked)
    {
      id: 9,
      title: "Professional Voice Over Demo 3",
      videoId: "1kkNhe7dgOF7SKtSzixLqlh2qce2pnPm4",
      type: "short",
      category: "Voice Over",
      driveUrl: "https://drive.google.com/file/d/1kkNhe7dgOF7SKtSzixLqlh2qce2pnPm4/view?usp=drive_link",
    },
    {
      id: 10,
      title: "Professional Voice Over Demo 4",
      videoId: "1afedH4AU-EvYOAIC2K2aDfuAgMFvCwBj",
      type: "short",
      category: "Voice Over",
      driveUrl: "https://drive.google.com/file/d/1afedH4AU-EvYOAIC2K2aDfuAgMFvCwBj/view?usp=drive_link",
    },
    {
      id: 11,
      title: "Explainer & Awareness Short 3",
      videoId: "1qWZUW4c8ZqbtFoJPFZo06buruayggBEW",
      type: "short",
      category: "Explainer",
      driveUrl: "https://drive.google.com/file/d/1qWZUW4c8ZqbtFoJPFZo06buruayggBEW/view?usp=drive_link",
    },
    {
      id: 12,
      title: "Explainer & Awareness Short 4",
      videoId: "10QAVtCyp8Bx-EcF1BTU36f-5djpOWHtB",
      type: "short",
      category: "Explainer",
      driveUrl: "https://drive.google.com/file/d/10QAVtCyp8Bx-EcF1BTU36f-5djpOWHtB/view?usp=drive_link",
    },
    {
      id: 13,
      title: "Explainer & Awareness Short 5",
      videoId: "1WHFyKYXLDqZzJunhy5Qezg78Wh6bXlG5",
      type: "short",
      category: "Explainer",
      driveUrl: "https://drive.google.com/file/d/1WHFyKYXLDqZzJunhy5Qezg78Wh6bXlG5/view?usp=drive_link",
    },
    {
      id: 14,
      title: "Brand Story Reel",
      videoId: "1cS8HdH6RWqftOw1LX-u2orhu7dXEHn5-",
      type: "short",
      category: "Branding",
      driveUrl: "https://drive.google.com/file/d/1cS8HdH6RWqftOw1LX-u2orhu7dXEHn5-/view?usp=drive_link",
    },
    {
      id: 15,
      title: "Social Media Content",
      videoId: "1kkNhe7dgOF7SKtSzixLqlh2qce2pnPm4",
      type: "short",
      category: "Social Media",
      driveUrl: "https://drive.google.com/file/d/1kkNhe7dgOF7SKtSzixLqlh2qce2pnPm4/view?usp=drive_link",
    },
    {
      id: 16,
      title: "Creative Transitions Reel",
      videoId: "1afedH4AU-EvYOAIC2K2aDfuAgMFvCwBj",
      type: "short",
      category: "Creative",
      driveUrl: "https://drive.google.com/file/d/1afedH4AU-EvYOAIC2K2aDfuAgMFvCwBj/view?usp=drive_link",
    },

    // Long Videos (16:9) - LONG-FORM CONTENT ONLY
    {
      id: 17,
      title: "Professional Podcast Production",
      videoId: "1dZuMt4U93NdTTAhV4ieeULDgs-97hd--",
      type: "long",
      category: "Podcast",
      duration: "12:30",
      driveUrl: "https://drive.google.com/file/d/1dZuMt4U93NdTTAhV4ieeULDgs-97hd--/view?usp=drive_link",
    },
    {
      id: 18,
      title: "Event Highlight Reel",
      videoId: "165c4U8x4OC9-VJLjnyYBoNe0M4_QkkeS",
      type: "long",
      category: "Event",
      duration: "8:45",
      driveUrl: "https://drive.google.com/file/d/165c4U8x4OC9-VJLjnyYBoNe0M4_QkkeS/view?usp=drive_link",
    },
    {
      id: 19,
      title: "Cinematic Brand Story",
      videoId: "1JRHTsp6rQziiP4IH7bGg597gwo3iRc5D",
      type: "long",
      category: "Cinematic",
      duration: "6:15",
      driveUrl: "https://drive.google.com/file/d/1JRHTsp6rQziiP4IH7bGg597gwo3iRc5D/view?usp=drive_link",
    },
    {
      id: 20,
      title: "This Motion Video Tells More Than Words",
      videoId: "R99jNSdoP3k",
      type: "long",
      category: "Industrial",
      duration: "3:24",
    },
    {
      id: 21,
      title: "Faceless Content Creation",
      videoId: "C4yYgiAkMck",
      type: "long",
      category: "YouTube",
      duration: "5:12",
    },
    {
      id: 22,
      title: "News Style Talking Head",
      videoId: "wfYmL2le6X4",
      type: "long",
      category: "YouTube",
      duration: "4:33",
    },
    {
      id: 23,
      title: "Professional Corporate Video",
      videoId: "zQzN2qqBo80",
      type: "long",
      category: "Corporate",
      duration: "6:18",
    },
    {
      id: 24,
      title: "Podcast Interview Edit",
      videoId: "4zDmEKKQheA",
      type: "long",
      category: "Documentary",
      duration: "8:45",
    },
  ]

  const shortVideos = videos.filter((v) => v.type === "short")
  const longVideos = videos.filter((v) => v.type === "long")

  // Show only first 8 videos initially (2 from each of 4 categories)
  const displayedShortVideos = showAllShorts ? shortVideos : shortVideos.slice(0, 8)

  const handleLongVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  const toggleShowAllShorts = () => {
    setShowAllShorts(!showAllShorts)
  }

  return (
    <section ref={sectionRef} id="work" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Work Speaks{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Louder</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Professional video editing across all formats and platforms
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab("shorts")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "shorts"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              Shorts/Reels ({shortVideos.length})
            </button>
            <button
              onClick={() => setActiveTab("long")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "long"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid className="h-4 w-4" />
              Long Videos ({longVideos.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "shorts" ? (
            <motion.div
              key="shorts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Info */}
              {!showAllShorts && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                  <p className="text-gray-400 text-sm">
                    Showing 2 videos from each category: Voice Over, Podcast, Explainer & Motion Graphics
                  </p>
                </motion.div>
              )}

              {/* Responsive Grid: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedShortVideos.map((video, index) => (
                  <VideoCard key={video.id} video={video} isVisible={isVisible} index={index} />
                ))}
              </div>

              {/* View All / Show Less Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Button
                  onClick={toggleShowAllShorts}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-8 py-3"
                  size="lg"
                >
                  {showAllShorts ? (
                    <>
                      Show Less
                      <ChevronUp className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      View All Shorts/Reels ({shortVideos.length - 8} more)
                      <ChevronDown className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="long"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Responsive Grid: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {longVideos.map((video, index) => (
                  <VideoCard key={video.id} video={video} isVisible={isVisible} index={index} />
                ))}
              </div>

              {/* View More Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-8 py-3"
                  size="lg"
                >
                  View All Long Videos
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal for Long Videos */}
      <VideoPlayerModal video={selectedVideo} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
