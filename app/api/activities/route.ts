import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch real activities from your data sources
    const activities = await fetchRealActivities()

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Activities API error:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

async function fetchRealActivities() {
  const activities = []

  // Fetch recent Paystack transactions
  if (process.env.PAYSTACK_SECRET_KEY) {
    try {
      const response = await fetch("https://api.paystack.co/transaction?perPage=5", {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const recentTransactions = data.data
          .filter((t: any) => t.status === "success")
          .slice(0, 3)
          .map((transaction: any) => ({
            id: transaction.id,
            type: "revenue",
            message: `Neural Commerce generated ₦${(transaction.amount / 100).toLocaleString()} in revenue`,
            timestamp: new Date(transaction.created_at),
            icon: "DollarSign",
            color: "text-green-400",
          }))

        activities.push(...recentTransactions)
      }
    } catch (error) {
      console.error("Failed to fetch Paystack activities:", error)
    }
  }

  // Add system status activities
  activities.push({
    id: Date.now(),
    type: "system",
    message: "Real-time revenue tracking system initialized",
    timestamp: new Date(),
    icon: "Zap",
    color: "text-blue-500",
  })

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
