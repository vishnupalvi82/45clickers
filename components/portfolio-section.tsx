"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePerformance } from "./performance-provider"

// Google Drive helper functions
function extractDriveFileId(url: string): string {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : ""
}

function getYouTubeVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? match[1] : ""
}

function getDriveThumbnail(driveUrl: string, aspectRatio: "16:9" | "9:16" = "16:9"): string {
  const fileId = extractDriveFileId(driveUrl)
  if (!fileId) return ""
  const size = aspectRatio === "9:16" ? "w400-h711" : "w400-h225"
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

function getDriveEmbedUrl(driveUrl: string): string {
  const fileId = extractDriveFileId(driveUrl)
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : ""
}

interface Video {
  id: number
  title: string
  category: string
  url: string
  type: "youtube" | "drive"
  aspectRatio: "16:9" | "9:16"
  row: number
}

interface VideoCardProps {
  video: Video
  isVisible: boolean
  index: number
  onClick: (video: Video) => void
}

function VideoCard({ video, isVisible, index, onClick }: VideoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { shouldReduceAnimations } = usePerformance()

  const getThumbnailUrl = (): string => {
    if (!isVisible) return "/placeholder.svg"

    if (video.type === "youtube") {
      const videoId = getYouTubeVideoId(video.url)
      return getYouTubeThumbnail(videoId)
    } else {
      return getDriveThumbnail(video.url, video.aspectRatio)
    }
  }

  const openVideoExternal = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(video.url, "_blank")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceAnimations ? 10 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceAnimations ? 0.3 : 0.6,
        delay: shouldReduceAnimations ? 0 : index * 0.1,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={
        shouldReduceAnimations
          ? {}
          : {
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3 },
            }
      }
      className={`group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer ${
        video.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"
      }`}
      onMouseEnter={() => !shouldReduceAnimations && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(video)}
    >
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Thumbnail */}
      <img
        src={getThumbnailUrl() || "/placeholder.svg"}
        alt={video.title}
        className={`w-full h-full object-cover transition-all duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        } ${shouldReduceAnimations ? "" : "group-hover:scale-105"}`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg?height=400&width=400&text=Video+Preview"
          setImageLoaded(true)
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all duration-300" />

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
          <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Category badge */}
      <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
          {video.category.toUpperCase()}
        </span>
      </div>

      {/* Format indicator */}
      <div className="absolute top-3 left-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        <span
          className={`${
            video.aspectRatio === "9:16" ? "bg-pink-600" : "bg-blue-600"
          } text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg`}
        >
          {video.aspectRatio === "9:16" ? "REEL" : "VIDEO"}
        </span>
      </div>

      {/* External link button */}
      <button
        onClick={openVideoExternal}
        className="absolute bottom-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Open in new tab"
      >
        <ExternalLink className="h-4 w-4" />
      </button>

      {/* Video info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">
          {video.title}
        </h3>
        <p className="text-gray-300 text-xs capitalize group-hover:text-blue-200 transition-colors duration-300">
          {video.category}
        </p>
      </div>
    </motion.div>
  )
}

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { shouldReduceAnimations } = usePerformance()

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

  const filters = [
    { id: "all", label: "All" },
    { id: "long-form", label: "Long-form Content" },
    { id: "reels", label: "Reels & Shorts" },
    { id: "podcast", label: "Podcast" },
    { id: "promotional", label: "Promotional" },
    { id: "interview", label: "Interview / Talking Head" },
    { id: "cinematic", label: "Cinematic" },
  ]

  // Organized video data according to row requirements
  const videos: Video[] = [
    // Row 1: Long-form Content (4 videos)
    {
      id: 1,
      title: "Professional Long-form Production",
      category: "long-form",
      url: "https://youtu.be/Wo1Zqm8n_W4?si=BjeeneO_WP-JrpCr",
      type: "youtube",
      aspectRatio: "16:9",
      row: 1,
    },
    {
      id: 2,
      title: "Corporate Training Video",
      category: "long-form",
      url: "https://youtu.be/TSP7AtX2qhw?si=ZHOjT3g5NF0ZIcpR",
      type: "youtube",
      aspectRatio: "16:9",
      row: 1,
    },
    {
      id: 3,
      title: "Educational Content Series",
      category: "long-form",
      url: "https://youtu.be/UD4_N-QJ-0k?si=T-FVqQ7JOuOfYc6-",
      type: "youtube",
      aspectRatio: "16:9",
      row: 1,
    },
    {
      id: 4,
      title: "Documentary Style Edit",
      category: "long-form",
      url: "https://drive.google.com/file/d/148AR745NAiwL6L_DHvj9fSGd4g-gbsbb/view?usp=sharing",
      type: "drive",
      aspectRatio: "16:9",
      row: 1,
    },

    // Row 2-3: Reels & Shorts (8 videos total)
    {
      id: 5,
      title: "Creative Brand Reel",
      category: "reels",
      url: "https://drive.google.com/file/d/1W0TAsFZlv-QFX59Y6UvIGONL92-YXZIs/view?usp=drive_link",
      type: "drive",
      aspectRatio: "9:16",
      row: 2,
    },
    {
      id: 6,
      title: "Social Media Short",
      category: "reels",
      url: "https://drive.google.com/file/d/1qcGNaVsZ_1i7SzmDYoSlFxVrhK_RHnRL/view?usp=drive_link",
      type: "drive",
      aspectRatio: "9:16",
      row: 2,
    },
    {
      id: 7,
      title: "Explainer Short",
      category: "reels",
      url: "https://drive.google.com/file/d/1S3lV--O8vcH7hvWu6yl-jFZukG-g4HcD/view?usp=drive_link",
      type: "drive",
      aspectRatio: "9:16",
      row: 2,
    },
    {
      id: 8,
      title: "Motion Graphics Reel",
      category: "reels",
      url: "https://drive.google.com/file/d/1YI4OeqvxnotKqd4cevmLTHQMgqxhjrxb/view?usp=drive_link",
      type: "drive",
      aspectRatio: "9:16",
      row: 2,
    },
    {
      id: 9,
      title: "Brand Story Reel",
      category: "reels",
      url: "https://drive.google.com/file/d/1BQMbX5xiB-fsQoJ2RA2bUkgK0yVn1FJh/view?usp=drive_link",
      type: "drive",
      aspectRatio: "9:16",
      row: 3,
    },
    {
      id: 10,
      title: "Viral Content Short",
      category: "reels",
      url: "https://drive.google.com/file/d/1Yzhy_MDSMl91lXUcSBRF5sTDQOZul-mM/view?usp=drive_link",
      type: "drive",
      aspectRatio: "9:16",
      row: 3,
    },
    {
      id: 11,
      title: "Trending Reel Edit",
      category: "reels",
      url: "https://drive.google.com/file/d/1tHycc0e_Sm2YbsP4zno8m8iNOkyibErU/view?usp=drive_link",
      type: "drive",
      aspectRatio: "9:16",
      row: 3,
    },
    {
      id: 12,
      title: "Voice Over Demo Reel",
      category: "reels",
      url: "https://drive.google.com/file/d/1wUbUSXSBwwoxR1w6i4NeyJbC5Gr6sj1J/view?usp=drive_link",
      type: "drive",
      aspectRatio: "9:16",
      row: 3,
    },

    // Row 4: Podcast (2-4 videos, center-aligned if fewer)
    {
      id: 13,
      title: "Professional Podcast Production",
      category: "podcast",
      url: "https://www.youtube.com/watch?v=IsZy60bvb_M",
      type: "youtube",
      aspectRatio: "16:9",
      row: 4,
    },
    {
      id: 14,
      title: "Podcast Interview Edit",
      category: "podcast",
      url: "https://drive.google.com/file/d/1IKUO31pnghUkouqIxGjXC4Ltp_OUT71e/view?usp=drive_link",
      type: "drive",
      aspectRatio: "16:9",
      row: 4,
    },

    // Row 5: Interview / Talking Head (4 videos)
    {
      id: 15,
      title: "Executive Interview",
      category: "interview",
      url: "https://youtu.be/UD4_N-QJ-0k?si=T-FVqQ7JOuOfYc6-",
      type: "youtube",
      aspectRatio: "16:9",
      row: 5,
    },
    {
      id: 16,
      title: "Professional Interview Setup",
      category: "interview",
      url: "https://youtu.be/x4p90nxUmzk?si=MNnOILbId1geLBOV",
      type: "youtube",
      aspectRatio: "16:9",
      row: 5,
    },
    {
      id: 17,
      title: "Corporate Talking Head",
      category: "interview",
      url: "https://youtu.be/olxqUs8NLC0?si=-ZAK1wOiuokbKjld",
      type: "youtube",
      aspectRatio: "16:9",
      row: 5,
    },
    {
      id: 18,
      title: "Expert Interview Edit",
      category: "interview",
      url: "https://drive.google.com/file/d/1n3V8SWSPupkhPwH-DLz9_8uNrJvRvARq/view?usp=drive_link",
      type: "drive",
      aspectRatio: "16:9",
      row: 5,
    },

    // Row 6: Cinematic + Promotional (4 videos side by side)
    {
      id: 19,
      title: "Cinematic Brand Story",
      category: "cinematic",
      url: "https://drive.google.com/file/d/1JRHTsp6rQziiP4IH7bGg597gwo3iRc5D/view?usp=drive_link",
      type: "drive",
      aspectRatio: "16:9",
      row: 6,
    },
    {
      id: 20,
      title: "Cinematic Production",
      category: "cinematic",
      url: "https://youtu.be/lJmfwzKJIMQ?si=hJYgIQJap0M7tdHH",
      type: "youtube",
      aspectRatio: "16:9",
      row: 6,
    },
    {
      id: 21,
      title: "Brand Promotional Video",
      category: "promotional",
      url: "https://drive.google.com/file/d/1VlTm_8aD5Y7vBgF3qmU3Y81kqsQwIyCA/view?usp=drive_link",
      type: "drive",
      aspectRatio: "16:9",
      row: 6,
    },
    {
      id: 22,
      title: "Product Launch Promo",
      category: "promotional",
      url: "https://drive.google.com/file/d/1VlTm_8aD5Y7vBgF3qmU3Y81kqsQwIyCA/view?usp=drive_link",
      type: "drive",
      aspectRatio: "16:9",
      row: 6,
    },
  ]

  const getFilteredVideos = () => {
    if (activeFilter === "all") return videos
    return videos.filter((video) => video.category === activeFilter)
  }

  const getVideosByRow = (videos: Video[]) => {
    const rows: { [key: number]: Video[] } = {}
    videos.forEach((video) => {
      if (!rows[video.row]) rows[video.row] = []
      rows[video.row].push(video)
    })
    return rows
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  const filteredVideos = getFilteredVideos()
  const videosByRow = getVideosByRow(filteredVideos)

  return (
    <section ref={sectionRef} id="portfolio" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Portfolio{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Gallery</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our diverse collection of video projects across different categories and formats
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4"></div>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white shadow-lg"
                    : "border-gray-700 hover:border-purple-500/50 text-gray-300 hover:text-white bg-transparent"
                }
                transition-all duration-300 hover:scale-105
              `}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Video Grid by Rows */}
        <div className="space-y-8">
          {Object.entries(videosByRow)
            .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
            .map(([rowNumber, rowVideos]) => (
              <motion.div
                key={`row-${rowNumber}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: Number.parseInt(rowNumber) * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`grid gap-6 ${
                  // Responsive grid with center alignment for incomplete rows
                  rowVideos.length < 4
                    ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-${rowVideos.length} justify-items-center`
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                } ${
                  // Center align rows with fewer than 4 videos
                  rowVideos.length < 4 ? "justify-center" : ""
                }`}
              >
                {rowVideos.map((video, index) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    isVisible={isVisible}
                    index={index}
                    onClick={handleVideoClick}
                  />
                ))}
              </motion.div>
            ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            size="lg"
          >
            View All Projects ({videos.length})
          </Button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative bg-black rounded-lg overflow-hidden shadow-2xl ${
                selectedVideo.aspectRatio === "9:16" ? "w-full max-w-sm aspect-[9/16]" : "w-full max-w-5xl aspect-video"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedVideo.type === "youtube" ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo.url)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe
                  className="w-full h-full"
                  src={getDriveEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>

              {/* External link button */}
              <button
                onClick={() => window.open(selectedVideo.url, "_blank")}
                className="absolute top-4 right-16 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                <ExternalLink className="h-4 w-4" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-white font-bold text-xl mb-2">{selectedVideo.title}</h3>
                <p className="text-gray-300 text-sm capitalize">{selectedVideo.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
