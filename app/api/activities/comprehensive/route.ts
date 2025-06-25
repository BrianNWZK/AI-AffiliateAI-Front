import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 Activities API called")

    // Initialize activities array
    const activities = []

    // Try to fetch Paystack activities if configured
    if (process.env.PAYSTACK_SECRET_KEY) {
      try {
        console.log("📊 Fetching Paystack activities...")
        const response = await fetch("https://api.paystack.co/transaction?perPage=5", {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const recentTransactions =
            data.data
              ?.filter((t: any) => t.status === "success")
              ?.slice(0, 3)
              ?.map((transaction: any) => ({
                id: `paystack-${transaction.id}`,
                type: "revenue",
                message: `Neural Commerce generated ₦${(transaction.amount / 100).toLocaleString()} in revenue`,
                timestamp: new Date(transaction.created_at),
                icon: "DollarSign",
                color: "text-green-400",
              })) || []

          activities.push(...recentTransactions)
          console.log(`✅ Added ${recentTransactions.length} Paystack activities`)
        } else {
          console.warn("⚠️ Paystack API error:", response.status)
        }
      } catch (error) {
        console.error("❌ Failed to fetch Paystack activities:", error)
      }
    } else {
      console.log("🔧 Paystack not configured, using demo activities")
    }

    // Add system activities
    activities.push({
      id: `system-${Date.now()}`,
      type: "system",
      message: "Real-time revenue tracking system initialized",
      timestamp: new Date(),
      icon: "Zap",
      color: "text-blue-500",
    })

    // If no real activities, add demo activities
    if (activities.length <= 1) {
      const demoActivities = [
        {
          id: "demo-revenue-1",
          type: "revenue",
          message: "Neural Commerce generated ₦25,000 in revenue",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          icon: "DollarSign",
          color: "text-green-400",
        },
        {
          id: "demo-ai-1",
          type: "ai",
          message: "AI optimization improved conversion by 8%",
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          icon: "TrendingUp",
          color: "text-purple-400",
        },
        {
          id: "demo-affiliate-1",
          type: "affiliate",
          message: "Affiliate partner generated ₦5,500",
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          icon: "Users",
          color: "text-blue-400",
        },
      ]
      activities.push(...demoActivities)
    }

    // Sort by timestamp (newest first)
    const sortedActivities = activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    console.log(`📊 Returning ${sortedActivities.length} activities`)

    return NextResponse.json({
      activities: sortedActivities,
      lastUpdated: new Date().toISOString(),
      status: "success",
      mode: process.env.PAYSTACK_SECRET_KEY ? "production" : "demo",
    })
  } catch (error) {
    console.error("❌ Activities API error:", error)

    // Return demo activities even on error
    const fallbackActivities = [
      {
        id: "fallback-1",
        type: "system",
        message: "System running in demo mode",
        timestamp: new Date(),
        icon: "Zap",
        color: "text-blue-500",
      },
      {
        id: "fallback-2",
        type: "revenue",
        message: "Demo: Neural Commerce generated ₦15,000",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        icon: "DollarSign",
        color: "text-green-400",
      },
    ]

    return NextResponse.json({
      activities: fallbackActivities,
      lastUpdated: new Date().toISOString(),
      status: "error",
      mode: "demo",
      error: "Using fallback data",
    })
  }
}
