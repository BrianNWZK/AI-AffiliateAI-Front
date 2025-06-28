"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Target, Users, Link, TrendingUp, Play, Pause } from "lucide-react"

interface AffiliateMetrics {
  activeCampaigns: number
  conversionRate: number
  totalClicks: number
  revenue: number
  topPerformers: { name: string; conversion: number; revenue: number }[]
}

const DEMO_METRICS: AffiliateMetrics = {
  activeCampaigns: 12,
  conversionRate: 3.7,
  totalClicks: 15420,
  revenue: 8750.5,
  topPerformers: [
    { name: "Tech Products Campaign", conversion: 4.2, revenue: 3200 },
    { name: "Health & Wellness", conversion: 3.8, revenue: 2800 },
    { name: "Digital Services", conversion: 3.1, revenue: 2750 },
  ],
}

export function AffiliateMarketingPanel() {
  const [isAutomationActive, setIsAutomationActive] = useState(true)
  const [metrics, setMetrics] = useState<AffiliateMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const router = useRouter()

  // Poll affiliate metrics every 15 seconds
  useEffect(() => {
    let active = true
    async function fetchMetrics() {
      setLoading(true)
      setError(null)
      try {
        // You must implement this endpoint in your backend!
        const res = await fetch("/api/affiliate/metrics")
        if (!res.ok) throw new Error("API returned error")
        const data = await res.json()
        if (active) {
          setMetrics(data)
          setLoading(false)
        }
      } catch (e) {
        if (active) {
          setError("Failed to load live metrics. Showing demo data.")
          setMetrics(DEMO_METRICS)
          setLoading(false)
        }
      }
    }
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 15000)
    return () => {
      active = false
      clearInterval(interval)
    }
    // eslint-disable-next-line
  }, [])

  const handleCreateCampaign = () => setShowCampaignModal(true)
  const handleViewReports = () => router.push("/reports")
  const handleOptimizeStrategies = () => alert("Optimize Strategies coming soon!")
  const handleViewAnalytics = () => router.push("/analytics")
  const handleViewActivities = () => router.push("/activities")

  return (
    <div className="neural-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-white">Affiliate Marketing AI</h2>
        </div>
        <button
          onClick={() => setIsAutomationActive(!isAutomationActive)}
          className={`p-2 rounded-lg transition-colors ${
            isAutomationActive ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/70"
          }`}
          aria-label={isAutomationActive ? "Pause Automation" : "Resume Automation"}
        >
          {isAutomationActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </div>

      {loading && <div className="text-white/80 mb-3">Loading live metrics...</div>}
      {error && <div className="text-red-400 mb-3">{error}</div>}

      {metrics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-white/70 text-sm">Active Campaigns</span>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.activeCampaigns}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-white/70 text-sm">Conversion Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-400">{metrics.conversionRate}%</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Link className="h-4 w-4 text-yellow-400" />
                <span className="text-white/70 text-sm">Total Clicks</span>
              </div>
              <p className="text-2xl font-bold text-white">{metrics.totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-white/70 text-sm">Revenue</span>
              </div>
              <p className="text-2xl font-bold text-green-400">${metrics.revenue.toLocaleString()}</p>
            </div>
          </div>
          {/* Top Performers */}
          <div>
            <h3 className="text-white font-medium mb-3">Top Performing Campaigns</h3>
            <div className="space-y-2">
              {metrics.topPerformers.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white/90 font-medium">{campaign.name}</p>
                    <p className="text-white/60 text-sm">{campaign.conversion}% conversion</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">${campaign.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="quantum-button flex-1" onClick={handleCreateCampaign}>Create Campaign</button>
        <button className="quantum-button flex-1" onClick={handleViewReports}>View Reports</button>
        <button className="quantum-button flex-1" onClick={handleOptimizeStrategies}>Optimize Strategies</button>
        <button className="quantum-button flex-1" onClick={handleViewAnalytics}>View Analytics</button>
        <button className="quantum-button flex-1" onClick={handleViewActivities}>View Activities</button>
      </div>

      {/* Simple Modal Example */}
      {showCampaignModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Create New Campaign</h3>
            <p className="text-white/80 mb-4">[Campaign creation form goes here]</p>
            <button className="quantum-button mt-2 w-full" onClick={() => setShowCampaignModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
