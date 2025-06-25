import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if APIs are configured and working
    const neuralStatus = await checkNeuralCommerceStatus()
    const affiliateStatus = await checkAffiliateStatus()
    const quantumStatus = await checkQuantumCoreStatus()

    return NextResponse.json({
      neural: neuralStatus,
      affiliate: affiliateStatus,
      quantum: quantumStatus,
    })
  } catch (error) {
    console.error("AI Status API error:", error)
    return NextResponse.json({ error: "Failed to fetch AI status" }, { status: 500 })
  }
}

async function checkNeuralCommerceStatus(): Promise<string> {
  // Check if Paystack integration is working
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return "offline"
  }

  try {
    const response = await fetch("https://api.paystack.co/transaction?perPage=1", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    return response.ok ? "active" : "error"
  } catch (error) {
    return "error"
  }
}

async function checkAffiliateStatus(): Promise<string> {
  // Check affiliate integrations
  if (!process.env.AFFILIATE_API_KEY) {
    return "offline"
  }

  // For now, return learning until you configure affiliate APIs
  return "learning"
}

async function checkQuantumCoreStatus(): Promise<string> {
  // Check if all core systems are operational
  const hasPaystack = !!process.env.PAYSTACK_SECRET_KEY
  const hasAffiliate = !!process.env.AFFILIATE_API_KEY

  if (hasPaystack || hasAffiliate) {
    return "active"
  }

  return "offline"
}
