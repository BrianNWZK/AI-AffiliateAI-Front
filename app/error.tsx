"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-400 mb-4">System Error</h1>
        <p className="text-white/80 mb-6">
          Something went wrong with the AI dashboard. This might be due to missing API keys or network issues.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
        <p className="text-white/40 text-xs mt-4">
          If the problem persists, check your environment variables in Vercel dashboard.
        </p>
      </div>
    </div>
  )
}
