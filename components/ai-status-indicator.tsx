"use client"

import { useState, useEffect } from "react"
import { Brain, Target, Zap } from "lucide-react"

interface AIStatusIndicatorProps {
  status?: {
    neural: string
    affiliate: string
    quantum: string
    mode?: string
  }
}

export function AIStatusIndicator({ status: initialStatus }: AIStatusIndicatorProps) {
  const [status, setStatus] = useState(
    initialStatus || {
      neural: "loading",
      affiliate: "loading",
      quantum: "loading",
      mode: "demo",
    },
  )

  useEffect(() => {
    const fetchAIStatus = async () => {
      try {
        const response = await fetch("/api/ai/status")
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        } else {
          // Fallback status
          setStatus({
            neural: "offline",
            affiliate: "offline",
            quantum: "offline",
            mode: "demo",
          })
        }
      } catch (error) {
        console.warn("Failed to fetch AI status:", error)
        setStatus({
          neural: "offline",
          affiliate: "offline",
          quantum: "offline",
          mode: "demo",
        })
      }
    }

    if (!initialStatus) {
      fetchAIStatus()
    }
  }, [initialStatus])

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "active":
        return "text-green-400"
      case "learning":
        return "text-yellow-400"
      case "loading":
        return "text-blue-400"
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusText = (statusValue: string) => {
    switch (statusValue) {
      case "active":
        return "Active"
      case "learning":
        return "Learning"
      case "loading":
        return "Loading..."
      case "error":
        return "Error"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="neural-card p-6">
      <h2 className="text-lg font-semibold text-white mb-4">AI Systems Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-white font-medium">Neural Commerce</p>
            <span className={`text-sm font-medium ${getStatusColor(status.neural)}`}>
              {getStatusText(status.neural)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-white font-medium">Affiliate AI</p>
            <span className={`text-sm font-medium ${getStatusColor(status.affiliate)}`}>
              {getStatusText(status.affiliate)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Zap className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-white font-medium">Quantum Core</p>
            <span className={`text-sm font-medium ${getStatusColor(status.quantum)}`}>
              {getStatusText(status.quantum)}
            </span>
          </div>
        </div>
      </div>

      {/* Mode indicator */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">System Mode:</span>
          <span className={`font-medium ${status.mode === "production" ? "text-green-400" : "text-yellow-400"}`}>
            {status.mode === "production" ? "Production" : "Demo Mode"}
          </span>
        </div>
      </div>
    </div>
  )
}
