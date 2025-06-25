import { NextResponse } from "next/server"
import { PaystackIntegration } from "@/lib/paystack-config"
import { SupabaseIntegration } from "@/lib/supabase-integration"
import { SendGridIntegration } from "@/lib/sendgrid-integration"
import { validateEnv } from "@/lib/env-config"

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        paystack: { status: "unknown", message: "" },
        supabase: { status: "unknown", message: "" },
        sendgrid: { status: "unknown", message: "" },
        jwt: { status: "unknown", message: "" },
      },
      environment: {
        hasPaystackKeys: !!(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_PUBLIC_KEY),
        hasSupabaseKeys: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        hasSendGridKey: !!process.env.SENDGRID_API_KEY,
        hasJWTKey: !!process.env.JWT_SECRET_KEY,
      }
    }

    // Test Paystack
    try {
      const paystack = new PaystackIntegration()
      const transactions = await paystack.getTransactions(1)
      health.services.paystack = {
        status: "healthy",
        message: `Connected - ${transactions.length} transactions accessible`
      }
    } catch (error) {
      health.services.paystack = {
        status: "error",
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }

    // Test Supabase
    try {
      const supabase = new SupabaseIntegration()
      const records = await supabase.getStoredRevenue(1)
      health.services.supabase = {
        status: "healthy",
        message: `Connected - ${records.length} records accessible`
      }
    } catch (error) {
      health.services.supabase = {
        status: "error",
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }

    // Test SendGrid (just check if API key exists)
    try {
      const sendgrid = new SendGridIntegration()
      health.services.sendgrid = {
        status: process.env.SENDGRID_API_KEY ? "healthy" : "not_configured",
        message: process.env.SENDGRID_API_KEY ? "API key configured" : "API key not configured"
      }
    } catch (error) {
      health.services.sendgrid = {
        status: "error",
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }

    // Test JWT
    try {
      const isValid = validateEnv()
      health.services.jwt = {
        status: process.env.JWT_SECRET_KEY ? "healthy" : "not_configured",
        message: process.env.JWT_SECRET_KEY ? "JWT secret configured" : "JWT secret not configured"
      }
    } catch (error) {
      health.services.jwt = {
        status: "error",
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }

    // Overall health status
    const hasErrors = Object.values(health.services).some(service => service.status === "error")
    health.status = hasErrors ? "degraded" : "healthy"

    return NextResponse.json(health)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
