import { NextResponse } from "next/server"
import { validateEnv, getPaystackConfig } from "@/lib/env-config"

export async function GET() {
  try {
    const envStatus = validateEnv()
    const paystackConfig = getPaystackConfig()

    // Check if APIs are configured and working
    const neuralStatus = await checkNeuralCommerceStatus(paystackConfig)
    const affiliateStatus = await checkAffiliateStatus()
    const quantumStatus = await checkQuantumCoreStatus(paystackConfig)

    return NextResponse.json({
      neural: neuralStatus,
      affiliate: affiliateStatus,
      quantum: quantumStatus,
      mode: envStatus.mode,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Status API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch AI status",
        neural: "error",
        affiliate: "error",
        quantum: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

async function checkNeuralCommerceStatus(paystackConfig: any): Promise<string> {
  // Check if Paystack integration is working
  if (!paystackConfig.isConfigured) {
    return "offline"
  }

  try {
    const response = await fetch("https://api.paystack.co/transaction?perPage=1", {
      headers: {
        Authorization: `Bearer ${paystackConfig.secretKey}`,
        "Content-Type": "application/json",
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

async function checkQuantumCoreStatus(paystackConfig: any): Promise<string> {
  // Check if all core systems are operational
  const hasPaystack = paystackConfig.isConfigured
  const hasAffiliate = !!process.env.AFFILIATE_API_KEY

  if (hasPaystack) {
    return "active"
  }

  if (hasAffiliate) {
    return "learning"
  }

  return "offline"
}
