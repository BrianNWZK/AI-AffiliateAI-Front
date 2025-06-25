// Updated to use comprehensive integrations
interface RevenueData {
  total: number
  neural: number
  affiliate: number
  growth: number
  breakdown?: {
    paystack: number
    ecommerce: number
    affiliate: number
  }
}

interface AIStatus {
  neural: string
  affiliate: string
  quantum: string
  integrations?: { [key: string]: boolean }
}

interface QuantumAIConfig {
  onRevenueUpdate: (data: RevenueData) => void
  onStatusChange: (status: AIStatus) => void
}

export async function initializeRealRevenueTracking(config: QuantumAIConfig) {
  // Fetch comprehensive revenue data
  const fetchComprehensiveRevenue = async () => {
    try {
      const response = await fetch("/api/revenue/comprehensive")
      if (!response.ok) throw new Error("Failed to fetch comprehensive revenue")

      const data = await response.json()
      config.onRevenueUpdate(data)
    } catch (error) {
      console.error("Comprehensive revenue fetch error:", error)
      config.onRevenueUpdate({
        total: 0,
        neural: 0,
        affiliate: 0,
        growth: 0,
      })
    }
  }

  // Fetch comprehensive AI status
  const fetchComprehensiveStatus = async () => {
    try {
      const response = await fetch("/api/ai/comprehensive-status")
      if (!response.ok) throw new Error("Failed to fetch comprehensive AI status")

      const status = await response.json()
      config.onStatusChange(status)
    } catch (error) {
      console.error("Comprehensive AI status fetch error:", error)
      config.onStatusChange({
        neural: "offline",
        affiliate: "offline",
        quantum: "offline",
      })
    }
  }

  // Initial fetch
  await fetchComprehensiveRevenue()
  await fetchComprehensiveStatus()

  // Set up real-time updates
  const revenueInterval = setInterval(fetchComprehensiveRevenue, 30000) // Every 30 seconds
  const statusInterval = setInterval(fetchComprehensiveStatus, 60000) // Every minute

  // Cleanup function
  return () => {
    clearInterval(revenueInterval)
    clearInterval(statusInterval)
  }
}
