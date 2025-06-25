import { NextResponse } from "next/server"
import { PaystackIntegration } from "@/lib/integrations/paystack"
import { AffiliateIntegration } from "@/lib/integrations/affiliate"
import { EcommerceIntegration } from "@/lib/integrations/ecommerce"

export async function GET() {
  try {
    const paystack = new PaystackIntegration()
    const affiliate = new AffiliateIntegration()
    const ecommerce = new EcommerceIntegration()

    // Fetch all revenue streams in parallel
    const [paystackRevenue, affiliateRevenue, ecommerceRevenue, previousMonthRevenue] = await Promise.all([
      paystack.getMonthlyRevenue().catch(() => 0),
      affiliate.getTotalAffiliateRevenue().catch(() => 0),
      ecommerce.getTotalEcommerceRevenue().catch(() => 0),
      getPreviousMonthRevenue().catch(() => 1000),
    ])

    const totalRevenue = paystackRevenue + affiliateRevenue + ecommerceRevenue
    const growth = previousMonthRevenue > 0 ? ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0

    return NextResponse.json({
      total: Math.round(totalRevenue * 100) / 100,
      neural: Math.round((paystackRevenue + ecommerceRevenue) * 100) / 100, // Neural Commerce
      affiliate: Math.round(affiliateRevenue * 100) / 100,
      growth: Math.round(growth * 100) / 100,
      breakdown: {
        paystack: Math.round(paystackRevenue * 100) / 100,
        ecommerce: Math.round(ecommerceRevenue * 100) / 100,
        affiliate: Math.round(affiliateRevenue * 100) / 100,
      },
    })
  } catch (error) {
    console.error("Comprehensive revenue API error:", error)
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 })
  }
}

async function getPreviousMonthRevenue(): Promise<number> {
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  try {
    const paystack = new PaystackIntegration()
    return await paystack.getMonthlyRevenue(lastMonth.getMonth(), lastMonth.getFullYear())
  } catch (error) {
    return 1000 // Fallback value
  }
}
