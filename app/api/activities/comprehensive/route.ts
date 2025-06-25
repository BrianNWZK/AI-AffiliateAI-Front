import { NextResponse } from "next/server"
import { PaystackIntegration } from "@/lib/paystack-config"

export async function GET() {
  try {
    const paystack = new PaystackIntegration()

    // Get recent Paystack activities
    const paystackActivities = await paystack.getRecentActivities(15)

    // Add system activities
    const systemActivities = [
      {
        id: Date.now(),
        type: "system",
        message: "Paystack integration active - fetching real revenue data",
        timestamp: new Date(),
        icon: "Zap",
        color: "text-blue-500",
      },
    ]

    const allActivities = [...paystackActivities, ...systemActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15)

    return NextResponse.json({
      activities: allActivities,
      total: allActivities.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Activities API error:", error)
    return NextResponse.json(
      {
        activities: [],
        total: 0,
        error: "Failed to fetch activities",
      },
      { status: 500 },
    )
  }
}
