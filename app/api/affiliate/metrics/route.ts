import { NextResponse } from "next/server"

// Proxy to backend affiliate metrics API
const BACKEND_URL = "https://ai-affiliate-backend.onrender.com/affiliate/metrics"

export async function GET() {
  try {
    const resp = await fetch(BACKEND_URL)
    if (!resp.ok) {
      throw new Error(`Backend error: ${resp.status}`)
    }
    const data = await resp.json()
    // Map backend response to expected frontend format if necessary
    return NextResponse.json(data)
  } catch (error) {
    console.error("Affiliate metrics API error:", error)
    // Fallback to demo metrics
    return NextResponse.json(
      {
        activeCampaigns: 12,
        conversionRate: 3.7,
        totalClicks: 15420,
        revenue: 8750.5,
        topPerformers: [
          { name: "Tech Products Campaign", conversion: 4.2, revenue: 3200 },
          { name: "Health & Wellness", conversion: 3.8, revenue: 2800 },
          { name: "Digital Services", conversion: 3.1, revenue: 2750 }
        ]
      },
      { status: 503 }
    )
  }
}
