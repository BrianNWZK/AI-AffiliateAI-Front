"use client"

import { useState, useEffect } from "react"
import { TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react"

interface RevenueMetricsProps {
  data?: {
    total: number
    neural: number
    affiliate: number
    growth: number
  }
}

export function RevenueMetrics({ data: initialData }: RevenueMetricsProps) {
  const [data, setData] = useState(
    initialData || {
      total: 0,
      neural: 0,
      affiliate: 0,
      growth: 0,
    },
  )
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData) {
      const fetchRevenue = async () => {
        try {
          const response = await fetch("/api/revenue/comprehensive")
          if (response.ok) {
            const revenueData = await response.json()
            setData(revenueData)
            setError(null)
          } else {
            const errorData = await response.json()
            setError(errorData.error || "Failed to fetch revenue data")
          }
        } catch (error) {
          console.error("Failed to fetch revenue data:", error)
          setError("An unexpected error occurred. Please try again later.")
        } finally {
          setLoading(false)
        }
      }

      fetchRevenue()

      // Refresh every 30 seconds
      const interval = setInterval(fetchRevenue, 30000)
      return () => clearInterval(interval)
    }
  }, [initialData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="neural-card p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-white/10 rounded mb-2 w-20"></div>
                <div className="h-8 bg-white/10 rounded w-24"></div>
              </div>
              <div className="h-8 w-8 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Revenue Overview</h2>
        <div className="text-white/60 text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      {error && <div className="text-red-400 mb-2">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="neural-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(data.total)}</p>
              <p className="text-white/50 text-xs mt-1">All-time earnings</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="neural-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Monthly Revenue</p>
              <p className="text-3xl font-bold text-blue-400">{formatCurrency(data.neural)}</p>
              <p className="text-white/50 text-xs mt-1">Current month</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="neural-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Affiliate Revenue</p>
              <p className="text-3xl font-bold text-yellow-400">{formatCurrency(data.affiliate)}</p>
              <p className="text-white/50 text-xs mt-1">Commission earnings</p>
            </div>
            <Users className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="neural-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Growth Rate</p>
              <p className={`text-3xl font-bold ${data.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                {data.growth >= 0 ? "+" : ""}
                {data.growth.toFixed(1)}%
              </p>
              <p className="text-white/50 text-xs mt-1">Month over month</p>
            </div>
            <TrendingUp className={`h-8 w-8 ${data.growth >= 0 ? "text-green-400" : "text-red-400"}`} />
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="neural-card p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-white/70">
            💡 {data.total > 0 ? "Real revenue data connected" : "Demo mode - Add Paystack keys for real data"}
          </div>
          <div className="text-white/50">Next update in: 30s</div>
        </div>
      </div>
    </div>
  )
}
