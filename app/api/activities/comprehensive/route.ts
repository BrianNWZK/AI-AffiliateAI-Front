// PATCH: Remove all demo/fallback activities; only return real, else error

import { NextResponse } from "next/server"

// Helper to find all affiliate API keys
function getAffiliateApiKeys() {
  const env = process.env as Record<string, string>;
  return Object.entries(env).filter(
    ([k, v]) =>
      (k.endsWith("_API_KEY") || k.includes("AFFILIATE") || k.includes("JVZOO") || k.includes("CLICKBANK") || k.includes("CJ") || k.includes("SHAREASALE") || k.includes("AMAZON"))
      && v && v.length > 0
  );
}

export async function GET() {
  try {
    const activities = []

    // Try to fetch Paystack activities if configured
    if (process.env.PAYSTACK_SECRET_KEY) {
      try {
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
        }
      } catch (error) {
        console.error("Failed to fetch Paystack activities:", error)
      }
    }

    // Affiliate activities
    const affiliateKeys = getAffiliateApiKeys();
    for (const [key, value] of affiliateKeys) {
      activities.push({
        id: `affiliate-${key}-${Date.now()}`,
        type: "affiliate",
        message: `Affiliate integration (${key}) detected and ready.`,
        timestamp: new Date(),
        icon: "Users",
        color: "text-blue-400",
      });
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

    // PATCH: Only return real activities, never fallback/demo
    if (activities.length <= 1) {
      return NextResponse.json({
        activities: [],
        lastUpdated: new Date().toISOString(),
        status: "error",
        mode: "production",
        error: "No real activities available",
      }, { status: 503 })
    }

    // Sort by timestamp (newest first)
    const sortedActivities = activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return NextResponse.json({
      activities: sortedActivities,
      lastUpdated: new Date().toISOString(),
      status: "success",
      mode: (process.env.PAYSTACK_SECRET_KEY || affiliateKeys.length > 0) ? "production" : "demo",
      affiliateKeys: affiliateKeys.map(([k]) => k),
    })
  } catch (error) {
    console.error("Activities API error:", error)
    // PATCH: Return error, never demo
    return NextResponse.json({
      activities: [],
      lastUpdated: new Date().toISOString(),
      status: "error",
      mode: "production",
      error: "Failed to fetch activities",
    }, { status: 500 })
  }
}
