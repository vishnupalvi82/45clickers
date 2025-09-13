"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Instagram, ExternalLink, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LinkTester() {
  const [testResults, setTestResults] = useState<{
    instagram: "pending" | "success" | "error" | "testing"
  }>({
    instagram: "pending",
  })

  const testInstagramLink = () => {
    setTestResults({ instagram: "testing" })

    const instagramUrl = "https://instagram.com/clickers_45"

    try {
      // Test if we can open the link
      const newWindow = window.open(instagramUrl, "_blank", "noopener,noreferrer")

      if (newWindow) {
        setTestResults({ instagram: "success" })

        // Check if the window was blocked after a short delay
        setTimeout(() => {
          if (newWindow.closed) {
            setTestResults({ instagram: "error" })
          }
        }, 1000)
      } else {
        setTestResults({ instagram: "error" })
      }
    } catch (error) {
      setTestResults({ instagram: "error" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "testing":
        return <AlertCircle className="h-5 w-5 text-yellow-500 animate-pulse" />
      default:
        return <ExternalLink className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Link opened successfully!"
      case "error":
        return "Link was blocked or failed to open"
      case "testing":
        return "Testing link..."
      default:
        return "Click to test"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "testing":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <motion.section
      className="py-12 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Social Media Link Test
              </span>
            </h3>
            <p className="text-gray-300">Test your Instagram link to ensure it opens correctly</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Instagram</h4>
                  <p className="text-sm text-gray-400">@clickers_45</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.instagram)}
                <span className={`text-sm ${getStatusColor(testResults.instagram)}`}>
                  {getStatusText(testResults.instagram)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={testInstagramLink}
                disabled={testResults.instagram === "testing"}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium flex-1"
              >
                {testResults.instagram === "testing" ? "Testing..." : "Test Instagram Link"}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={() => window.open("https://instagram.com/clickers_45", "_blank", "noopener,noreferrer")}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Direct Open
              </Button>
            </div>

            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <h5 className="font-medium mb-2 text-sm">Link Details:</h5>
              <div className="text-xs text-gray-400 space-y-1">
                <div>
                  URL: <span className="text-blue-400">https://instagram.com/clickers_45</span>
                </div>
                <div>
                  Target: <span className="text-green-400">_blank</span>
                </div>
                <div>
                  Security: <span className="text-green-400">noopener,noreferrer</span>
                </div>
              </div>
            </div>

            {testResults.instagram === "error" && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <h5 className="font-medium mb-2 text-red-400">Troubleshooting Tips:</h5>
                <ul className="text-xs text-red-300 space-y-1">
                  <li>• Check if popup blocker is enabled</li>
                  <li>• Try allowing popups for this site</li>
                  <li>• Test in different browsers (Chrome, Firefox, Safari)</li>
                  <li>• Check if Instagram is accessible in your region</li>
                </ul>
              </div>
            )}

            {testResults.instagram === "success" && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <h5 className="font-medium mb-2 text-green-400">✅ Link Working Correctly!</h5>
                <p className="text-xs text-green-300">
                  Your Instagram link opens successfully. Visitors will be able to reach your profile without issues.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">This test opens the actual Instagram link to verify functionality</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
