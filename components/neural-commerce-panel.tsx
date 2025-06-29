"use client"

import { useEffect, useState } from "react"
import { Brain, Globe, TrendingUp, Settings } from "lucide-react"

// This panel now polls backend for live metrics/status and supports "Optimize Strategies" action.
export function NeuralCommercePanel() {
  const [metrics, setMetrics] = useState({
    globalAnalysis: "Loading...",
    automationLevel: 0,
    marketTrends: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [optimizing, setOptimizing] = useState(false)
  const [optimizeMsg, setOptimizeMsg] = useState<string | null>(null)

  // Poll backend for neural metrics
  useEffect(() => {
    let active = true
    const fetchMetrics = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/neural/metrics")
        if (!res.ok) throw new Error("Neural metrics API error")
        const data = await res.json()
        if (active) setMetrics(data)
      } catch (e: any) {
        setError("Failed to fetch Neural Commerce metrics. Showing demo data.")
        if (active)
          setMetrics({
            globalAnalysis: "Processing 2.3M data points",
            automationLevel: 87,
            marketTrends: [
              { region: "North America", growth: 12.5, status: "bullish" },
              { region: "Europe", growth: 8.3, status: "stable" },
              { region: "Asia Pacific", growth: 15.7, status: "bullish" },
            ],
          })
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 15000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  // Optimize Strategies action button
  const handleOptimize = async () => {
    setOptimizing(true)
    setOptimizeMsg(null)
    try {
      // Call backend endpoint for optimization (replace with your backend endpoint if different)
      const res = await fetch("/api/neural/optimize", { method: "POST" })
      if (!res.ok) throw new Error("Failed to optimize strategies")
      const data = await res.json()
      setOptimizeMsg(data.message || "Optimization triggered successfully!")
    } catch (e: any) {
      setOptimizeMsg("Failed to trigger optimization. Please try again.")
    } finally {
      setOptimizing(false)
      setTimeout(() => setOptimizeMsg(null), 7000)
    }
  }

  return (
    <div className="neural-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-white">Neural Commerce Ecosystem</h2>
        </div>
        <button className="p-2 text-white/70 hover:text-white transition-colors" aria-label="Settings" title="Settings (coming soon)">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Error */}
      {error && <div className="text-red-400 mb-3">{error}</div>}
      {/* Optimize Feedback */}
      {optimizeMsg && <div className="text-blue-400 mb-3">{optimizeMsg}</div>}

      {/* Global Analysis Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Globe className="h-5 w-5 text-blue-500" />
          <span className="text-white font-medium">Global Commerce Analysis</span>
        </div>
        <p className="text-white/70 text-sm">{metrics.globalAnalysis}</p>
        <div className="mt-2 bg-white/10 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${metrics.automationLevel}%` }}
          />
        </div>
        <p className="text-xs text-white/50 mt-1">Automation Level: {metrics.automationLevel}%</p>
      </div>

      {/* Market Trends */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Regional Market Trends
        </h3>
        <div className="space-y-3">
          {metrics.marketTrends.map((trend: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">{trend.region}</span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${trend.status === "bullish" ? "text-green-400" : "text-yellow-400"}`}
                >
                  +{trend.growth}%
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    trend.status === "bullish"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {trend.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button
          className="quantum-button flex-1"
          onClick={handleOptimize}
          disabled={optimizing}
        >
          {optimizing ? "Optimizing..." : "Optimize Strategies"}
        </button>
        <button className="quantum-button flex-1" onClick={() => window.location.href="/analytics"}>
          View Analytics
        </button>
      </div>
    </div>
  )
}
