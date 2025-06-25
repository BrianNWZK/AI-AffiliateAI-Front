"use client"

import { useState, useEffect } from "react"
import { RevenueMetrics } from "@/components/revenue-metrics"
import { NeuralCommercePanel } from "@/components/neural-commerce-panel"
import { AffiliateMarketingPanel } from "@/components/affiliate-marketing-panel"
import { ActivityFeed } from "@/components/activity-feed"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState(null)
  const [revenueData, setRevenueData] = useState({
    total: 0,
    neural: 0,
    affiliate: 0,
    growth: 0,
  })

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check system health with error handling
        console.log("🔍 Checking system health...")

        let health = null
        try {
          const healthResponse = await fetch("/api/system/health")
          health = await healthResponse.json()
          console.log("📊 System Health Report:", health)
          setSystemStatus(health)
        } catch (healthError) {
          console.warn("⚠️ Health check failed, using fallback:", healthError)
          setSystemStatus({
            mode: "demo",
            environment: { isValid: false, status: "demo" },
            services: { paystack: { configured: false, status: "not_configured" } },
            recommendations: ["Add PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY for real data"],
          })
        }

        // Fetch revenue data with error handling
        console.log("💰 Fetching revenue data...")
        try {
          const revenueResponse = await fetch("/api/revenue/comprehensive")
          if (revenueResponse.ok) {
            const revenue = await revenueResponse.json()
            console.log("📈 Revenue Data:", revenue)
            setRevenueData(revenue)
          } else {
            console.log("📊 Using demo revenue data")
            setRevenueData({
              total: 125000,
              neural: 45000,
              affiliate: 25000,
              growth: 12.5,
            })
          }
        } catch (revenueError) {
          console.warn("⚠️ Revenue fetch failed, using demo data:", revenueError)
          setRevenueData({
            total: 125000,
            neural: 45000,
            affiliate: 25000,
            growth: 12.5,
          })
        }

        // Log final status
        if (health?.services?.paystack?.status === "connected") {
          console.log("✅ Paystack is connected and working")
          console.log(`📊 Found ${health.services.paystack.test.transactionCount} transactions`)
        } else {
          console.log("🔧 Demo mode - Add Paystack keys for real data")
        }

        // Show recommendations
        if (health?.recommendations?.length > 0) {
          console.log("💡 Setup Recommendations:")
          health.recommendations.forEach((rec: string) => console.log(`  - ${rec}`))
        }
      } catch (error) {
        console.error("❌ Dashboard initialization failed:", error)
        // Set fallback data so dashboard still works
        setSystemStatus({
          mode: "demo",
          environment: { isValid: false, status: "error" },
          services: { paystack: { configured: false, status: "error" } },
          recommendations: ["Check console for errors", "Add Paystack keys for real data"],
        })
        setRevenueData({
          total: 125000,
          neural: 45000,
          affiliate: 25000,
          growth: 12.5,
        })
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading AI SaaS Dashboard...</div>
          <div className="text-white/60 text-sm mt-2">Initializing revenue tracking systems</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">AI SaaS Dashboard</h1>
            <p className="text-white/60 text-sm">Multi-Platform Revenue Tracking</p>
          </div>
          <div className="text-right">
            <div className="text-white/80 text-sm">
              {systemStatus?.environment?.isValid ? "🟢 All Systems Operational" : "🟡 Demo Mode"}
            </div>
            <div className="text-white/60 text-xs">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </header>

      {/* System Status Banner */}
      {systemStatus && (
        <div className="container mx-auto px-4 py-3">
          <div
            className={`p-4 rounded-lg text-sm ${
              systemStatus.environment?.isValid
                ? "bg-green-900/20 text-green-400 border border-green-500/20"
                : "bg-blue-900/20 text-blue-400 border border-blue-500/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {systemStatus.environment?.isValid
                    ? "✅ Production Mode - Real Data Connected"
                    : "🔧 Demo Mode - Add API Keys for Real Data"}
                </div>
                <div className="text-xs opacity-80 mt-1">
                  {systemStatus.services?.paystack?.configured
                    ? `Paystack Connected: ${systemStatus.services.paystack.test.transactionCount} transactions found`
                    : "Paystack: Using demo data - Add PAYSTACK_SECRET_KEY for real transactions"}
                </div>
              </div>
              <div className="text-xs">
                <div>Environment: {systemStatus.environment?.nodeEnv}</div>
                <div>Status: {systemStatus.services?.paystack?.status}</div>
              </div>
            </div>

            {/* Recommendations */}
            {systemStatus.recommendations?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="text-xs font-medium mb-1">💡 Quick Setup:</div>
                <div className="text-xs space-y-1">
                  {systemStatus.recommendations.slice(0, 2).map((rec: string, index: number) => (
                    <div key={index}>• {rec}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Metrics */}
          <div className="lg:col-span-3">
            <RevenueMetrics data={revenueData} />
          </div>

          {/* Neural Commerce Panel */}
          <div className="lg:col-span-2">
            <NeuralCommercePanel />
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>

          {/* Affiliate Marketing Panel */}
          <div className="lg:col-span-3">
            <AffiliateMarketingPanel />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="text-center text-white/60 text-sm">
            <div className="mb-2">🚀 AI SaaS Dashboard - Multi-Platform Revenue Tracking</div>
            <div className="text-xs">
              {systemStatus?.environment?.isValid
                ? "Connected to live payment systems"
                : "Demo mode - Add your API keys in Vercel dashboard for real data"}
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
