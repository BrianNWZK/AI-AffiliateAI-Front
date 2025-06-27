import { NextResponse } from "next/server"

const BACKEND_URL = "https://ai-affiliate-backend.onrender.com/paystack/revenue"

export async function GET() {
  try {
    const resp = await fetch(BACKEND_URL)
    if (!resp.ok) {
      throw new Error(`Backend error: ${resp.status}`)
    }
    const backendData = await resp.json()

    // Map backend response to the expected frontend format
    const responseData = {
      total: backendData.amount ?? 0,
      neural: backendData.amount ?? 0,
      affiliate: 0,
      growth: 0, // Can't calculate without historical data
      breakdown: {
        paystack: backendData.amount ?? 0,
        monthly: backendData.amount ?? 0,
        total: backendData.amount ?? 0,
      },
      recentTransactions: [],
      lastUpdated: backendData.timestamp ?? new Date().toISOString(),
    }

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
