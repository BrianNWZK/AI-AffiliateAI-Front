import { NextResponse } from "next/server"
import { validateEnv, getPaystackConfig } from "@/lib/env-config"

// Scan for all affiliate-related keys
function getAffiliateApiKeys() {
  const env = process.env as Record<string, string>
  return Object.keys(env).filter(
    k =>
      (k.endsWith("_API_KEY") ||
        k.includes("AFFILIATE") ||
        k.includes("JVZOO") ||
        k.includes("CLICKBANK") ||
        k.includes("CJ") ||
        k.includes("SHAREASALE") ||
        k.includes("AMAZON")) &&
      env[k] &&
      env[k].length > 0
  )
}

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
      { status: 500 }
    )
  }
}

async function checkNeuralCommerceStatus(paystackConfig: any): Promise<string> {
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
  const affiliateKeys = getAffiliateApiKeys()
  if (affiliateKeys.length === 0) {
    return "offline"
  }
  // If you want to show "active" when you have a real integration, update this logic
  return "learning"
}

async function checkQuantumCoreStatus(paystackConfig: any): Promise<string> {
  const hasPaystack = paystackConfig.isConfigured
  const hasAffiliate = getAffiliateApiKeys().length > 0

  if (hasPaystack) {
    return "active"
  }

  if (hasAffiliate) {
    return "learning"
  }

  return "offline"
}
