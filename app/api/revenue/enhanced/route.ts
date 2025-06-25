import { NextResponse } from "next/server"
import { PaystackIntegration } from "@/lib/paystack-config"
import { SupabaseIntegration } from "@/lib/supabase-integration"
import { SendGridIntegration } from "@/lib/sendgrid-integration"
import { validateEnv } from "@/lib/env-config"

export async function GET() {
  try {
    // Validate environment variables
    validateEnv()

    const paystack = new PaystackIntegration()
    const supabase = new SupabaseIntegration()
    const sendgrid = new SendGridIntegration()

    // Get real Paystack data
    const [currentMonthRevenue, totalRevenue, recentTransactions] = await Promise.all([
      paystack.getMonthlyRevenue(),
      paystack.getTotalRevenue(),
      paystack.getRecentActivities(5),
    ])

    // Get previous month for growth calculation
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const previousMonthRevenue = await paystack.getMonthlyRevenue(lastMonth.getMonth(), lastMonth.getFullYear())

    // Calculate growth
    const growth =
      previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : currentMonthRevenue > 0
          ? 100
          : 0

    // Store in Supabase if configured and revenue exists
    if (currentMonthRevenue > 0) {
      await supabase.storeRevenue({
        source: "paystack",
        amount: currentMonthRevenue,
        currency: "NGN",
        metadata: { 
          month: new Date().getMonth() + 1, 
          year: new Date().getFullYear(),
          growth: growth 
        },
      })
    }

    // Send email alert for significant revenue milestones
    if (currentMonthRevenue > 100000) {
      // ₦100,000 milestone
      await sendgrid.sendRevenueAlert({
        to: "admin@yoursaas.com",
        amount: currentMonthRevenue,
        source: "Monthly Revenue Milestone - Paystack",
      })
    }

    // Send daily report if it's a new day
    const today = new Date().toDateString()
    const lastReportDate = await getLastReportDate()
    
    if (lastReportDate !== today && totalRevenue > 0) {
      const todayTransactions = recentTransactions.filter(t => 
        new Date(t.timestamp).toDateString() === today
      )
      
      const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      
      await sendgrid.sendDailyReport({
        to: "admin@yoursaas.com",
        totalRevenue,
        todayRevenue,
        transactionCount: todayTransactions.length,
      })
      
      await setLastReportDate(today)
    }

    const responseData = {
      total: Math.round(totalRevenue * 100) / 100,
      neural: Math.round(currentMonthRevenue * 100) / 100,
      affiliate: 0,
      growth: Math.round(growth * 100) / 100,
      breakdown: {
        paystack: Math.round(currentMonthRevenue * 100) / 100,
        monthly: Math.round(currentMonthRevenue * 100) / 100,
        total: Math.round(totalRevenue * 100) / 100,
      },
      recentTransactions: recentTransactions.slice(0, 3),
      lastUpdated: new Date().toISOString(),
      integrations: {
        paystack: !!process.env.PAYSTACK_SECRET_KEY,
        supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        sendgrid: !!process.env.SENDGRID_API_KEY,
      }
    }

    console.log("Enhanced Revenue API Response:", responseData)
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Enhanced revenue API error:", error)
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

// Simple in-memory storage for demo (use database in production)
let lastReportDate = ""

async function getLastReportDate(): Promise<string> {
  return lastReportDate
}

async function setLastReportDate(date: string): Promise<void> {
  lastReportDate = date
}
