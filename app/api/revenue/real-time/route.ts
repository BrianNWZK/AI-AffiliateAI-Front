import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 1. Fetch Paystack Revenue
    const paystackRevenue = await fetchPaystackRevenue()

    // 2. Fetch Affiliate Revenue
    const affiliateRevenue = await fetchAffiliateRevenue()

    // 3. Calculate totals
    const totalRevenue = paystackRevenue + affiliateRevenue
    const previousMonthTotal = await getPreviousMonthRevenue()
    const growth = previousMonthTotal > 0 ? ((totalRevenue - previousMonthTotal) / previousMonthTotal) * 100 : 0

    return NextResponse.json({
      total: totalRevenue,
      neural: paystackRevenue, // Neural Commerce via Paystack
      affiliate: affiliateRevenue,
      growth: Math.round(growth * 100) / 100,
    })
  } catch (error) {
    console.error("Revenue API error:", error)
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 })
  }
}

async function fetchPaystackRevenue(): Promise<number> {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.warn("Paystack secret key not configured")
    return 0
  }

  try {
    const response = await fetch("https://api.paystack.co/transaction", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.status}`)
    }

    const data = await response.json()

    // Calculate total successful transactions for current month
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyRevenue = data.data
      .filter((transaction: any) => {
        const transactionDate = new Date(transaction.created_at)
        return (
          transaction.status === "success" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        )
      })
      .reduce((total: number, transaction: any) => total + transaction.amount / 100, 0)

    return monthlyRevenue
  } catch (error) {
    console.error("Paystack fetch error:", error)
    return 0
  }
}

async function fetchAffiliateRevenue(): Promise<number> {
  // This would integrate with your actual affiliate networks
  // For now, return 0 until you configure affiliate APIs

  if (!process.env.AFFILIATE_API_KEY) {
    console.warn("Affiliate API key not configured")
    return 0
  }

  try {
    // Example: Commission Junction API
    // const response = await fetch('https://api.cj.com/earnings', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.AFFILIATE_API_KEY}`,
    //   },
    // })

    // For now, return 0 until you set up affiliate integrations
    return 0
  } catch (error) {
    console.error("Affiliate fetch error:", error)
    return 0
  }
}

async function getPreviousMonthRevenue(): Promise<number> {
  // This would fetch previous month's data for growth calculation
  // For now, return a base value
  return 1000 // You can implement this based on your data storage
}
