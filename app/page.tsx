"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { NeuralCommercePanel } from "@/components/neural-commerce-panel"
import { AffiliateMarketingPanel } from "@/components/affiliate-marketing-panel"
import { RevenueMetrics } from "@/components/revenue-metrics"
import { ActivityFeed } from "@/components/activity-feed"
import { AIStatusIndicator } from "@/components/ai-status-indicator"

export default function Dashboard() {
  const [revenueData, setRevenueData] = useState({
    total: 0,
    neural: 0,
    affiliate: 0,
    growth: 0,
  })

  const [aiStatus, setAiStatus] = useState({
    neural: "offline",
    affiliate: "offline",
    quantum: "offline",
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize real revenue tracking
    let cleanup: (() => void) | undefined

    const initializeRealData = async () => {
      try {
        const { initializeRealRevenueTracking } = await import("@/lib/real-revenue-integration")
        cleanup = await initializeRealRevenueTracking({
          onRevenueUpdate: setRevenueData,
          onStatusChange: setAiStatus,
        })
      } catch (error) {
        console.error("Failed to initialize real data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeRealData()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Initializing AI Systems...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* AI Status Bar */}
        <div className="mb-8">
          <AIStatusIndicator status={aiStatus} />
        </div>

        {/* Revenue Metrics */}
        <div className="mb-8">
          <RevenueMetrics data={revenueData} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <NeuralCommercePanel />
          <AffiliateMarketingPanel />
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </main>
    </div>
  )
}
