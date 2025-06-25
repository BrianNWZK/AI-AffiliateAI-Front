import { NextResponse } from "next/server"
import { PaystackIntegration } from "@/lib/integrations/paystack"
import { AffiliateIntegration } from "@/lib/integrations/affiliate"

export async function GET() {
  try {
    const paystack = new PaystackIntegration()
    const affiliate = new AffiliateIntegration()

    // Fetch activities from all sources
    const [paystackActivities, affiliateActivities] = await Promise.all([
      paystack.getRecentActivities(5).catch(() => []),
      affiliate.getAffiliateActivities().catch(() => []),
    ])

    // Combine and sort activities
    const allActivities = [...paystackActivities, ...affiliateActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    // Add system activities
    allActivities.push({
      id: Date.now(),
      type: "system",
      message: "Multi-platform revenue tracking active",
      timestamp: new Date(),
      icon: "Zap",
      color: "text-blue-500",
    })

    return NextResponse.json(allActivities)
  } catch (error) {
    console.error("Comprehensive activities API error:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}
