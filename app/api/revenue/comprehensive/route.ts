import { NextResponse } from "next/server"
import { PaystackIntegration } from "@/lib/paystack-config"

export async function GET() {
  try {
    const paystack = new PaystackIntegration()

    // Get real Paystack data
    const [currentMonthRevenue, totalRevenue, recentTransactions] = await Promise.all([
      paystack.getMonthlyRevenue(),
      paystack.getTotalRevenue(),
      paystack.getRecentActivities(5),
    ])

    // Get previous month for growth calculation
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const previousMonthRevenue = await paystack.getMonthlyRevenue(lastMonth.getMonth(), lastMonth.getFullYear())

    // Calculate growth
    const growth =
      previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : currentMonthRevenue > 0
          ? 100
          : 0

    const responseData = {
      total: Math.round(totalRevenue * 100) / 100,
      neural: Math.round(currentMonthRevenue * 100) / 100,
      affiliate: 0,
      growth: Math.round(growth * 100) / 100,
      breakdown: {
        paystack: Math.round(currentMonthRevenue * 100) / 100,
        monthly: Math.round(currentMonthRevenue * 100) / 100,
        total: Math.round(totalRevenue * 100) / 100,
      },
      recentTransactions: recentTransactions.slice(0, 3),
      lastUpdated: new Date().toISOString(),
    }

    console.log("Real Paystack Revenue:", responseData)
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Revenue API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch revenue data",
        total: 0,
        neural: 0,
        affiliate: 0,
        growth: 0,
      },
      { status: 500 },
    )
  }
}
