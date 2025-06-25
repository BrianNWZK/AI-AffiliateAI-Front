"use client"

import { TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react"

interface RevenueMetricsProps {
  data: {
    total: number
    neural: number
    affiliate: number
    growth: number
  }
}

export function RevenueMetrics({ data }: RevenueMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="neural-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Total Revenue</p>
            <p className="revenue-metric">{formatCurrency(data.total)}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-400" />
        </div>
      </div>

      <div className="neural-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Neural Commerce</p>
            <p className="revenue-metric">{formatCurrency(data.neural)}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="neural-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Affiliate Revenue</p>
            <p className="revenue-metric">{formatCurrency(data.affiliate)}</p>
          </div>
          <Users className="h-8 w-8 text-yellow-400" />
        </div>
      </div>

      <div className="neural-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Growth Rate</p>
            <p className="revenue-metric">{data.growth.toFixed(1)}%</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-400" />
        </div>
      </div>
    </div>
  )
}
