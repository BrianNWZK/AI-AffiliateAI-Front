import { NextResponse } from "next/server"

const BACKEND_URL = "https://ai-affiliate-backend.onrender.com/api/v1/paystack/revenue/all"

export async function GET() {
  try {
    const resp = await fetch(BACKEND_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!resp.ok) {
      throw new Error(`Backend error: ${resp.status}`)
    }

    const backendData = await resp.json()

    const totalRevenue = backendData.total_revenue || 0
    const monthlyRevenue = backendData.month_revenue || 0
    const affiliateRevenue = backendData.total_affiliate_revenue || 0

    // Basic growth calculation (replace with more sophisticated logic if needed)
    const growth = totalRevenue > 0 ? (monthlyRevenue / totalRevenue) * 100 : 0

    const responseData = {
      total: totalRevenue,
      neural: monthlyRevenue,
      affiliate: affiliateRevenue,
      growth: parseFloat(growth.toFixed(1)) || 0,
      breakdown: {
        paystack: totalRevenue,
        monthly: monthlyRevenue,
        total: totalRevenue,
      },
      recentTransactions: backendData.recent_transactions || [],
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Revenue API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch revenue data. Please check the backend service.",
        total: 0,
        neural: 0,
        affiliate: 0,
        growth: 0,
        breakdown: {},
        recentTransactions: [],
      },
      { status: 503 }, // Service Unavailable
    )
  }
}
