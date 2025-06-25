import { NextResponse } from "next/server"

export async function GET() {
  try {
    const status = {
      neural: await checkNeuralStatus(),
      affiliate: await checkAffiliateStatus(),
      quantum: await checkQuantumStatus(),
      integrations: await checkIntegrations(),
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("Comprehensive AI status error:", error)
    return NextResponse.json({ error: "Failed to fetch AI status" }, { status: 500 })
  }
}

async function checkNeuralStatus(): Promise<string> {
  const hasPaystack = !!process.env.PAYSTACK_SECRET_KEY
  const hasShopify = !!process.env.SHOPIFY_ACCESS_TOKEN
  const hasStripe = !!process.env.STRIPE_SECRET_KEY

  if (hasPaystack || hasShopify || hasStripe) {
    return "active"
  }
  return "offline"
}

async function checkAffiliateStatus(): Promise<string> {
  const hasCJ = !!process.env.CJ_API_KEY
  const hasAmazon = !!process.env.AMAZON_ASSOCIATES_KEY
  const hasClickBank = !!process.env.CLICKBANK_API_KEY

  if (hasCJ || hasAmazon || hasClickBank) {
    return "active"
  }
  return "learning"
}

async function checkQuantumStatus(): Promise<string> {
  const totalIntegrations = [
    process.env.PAYSTACK_SECRET_KEY,
    process.env.SHOPIFY_ACCESS_TOKEN,
    process.env.CJ_API_KEY,
    process.env.STRIPE_SECRET_KEY,
  ].filter(Boolean).length

  if (totalIntegrations >= 2) return "active"
  if (totalIntegrations >= 1) return "learning"
  return "offline"
}

async function checkIntegrations(): Promise<{ [key: string]: boolean }> {
  return {
    paystack: !!process.env.PAYSTACK_SECRET_KEY,
    shopify: !!process.env.SHOPIFY_ACCESS_TOKEN,
    stripe: !!process.env.STRIPE_SECRET_KEY,
    cj: !!process.env.CJ_API_KEY,
    amazon: !!process.env.AMAZON_ASSOCIATES_KEY,
    clickbank: !!process.env.CLICKBANK_API_KEY,
    analytics: !!process.env.GOOGLE_ANALYTICS_KEY,
  }
}
