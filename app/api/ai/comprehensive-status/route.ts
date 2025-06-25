import { NextResponse } from "next/server"
import { validateEnv, getPaystackConfig, getSupabaseConfig, getSendGridConfig } from "@/lib/env-config"

export async function GET() {
  try {
    const envStatus = validateEnv()
    const paystackConfig = getPaystackConfig()
    const supabaseConfig = getSupabaseConfig()
    const sendgridConfig = getSendGridConfig()

    // Test Paystack connection if configured
    let paystackStatus = "offline"
    let transactionCount = 0

    if (paystackConfig.isConfigured) {
      try {
        const response = await fetch("https://api.paystack.co/transaction?perPage=1", {
          headers: {
            Authorization: `Bearer ${paystackConfig.secretKey}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          paystackStatus = "online"
          transactionCount = data.meta?.total || 0
        } else {
          paystackStatus = "error"
        }
      } catch (error) {
        console.warn("Paystack connection test failed:", error)
        paystackStatus = "error"
      }
    }

    // Test Supabase connection if configured
    let supabaseStatus = "offline"
    if (supabaseConfig.isConfigured) {
      try {
        const response = await fetch(`${supabaseConfig.url}/rest/v1/`, {
          headers: {
            apikey: supabaseConfig.serviceRoleKey,
            Authorization: `Bearer ${supabaseConfig.serviceRoleKey}`,
          },
        })
        supabaseStatus = response.ok ? "online" : "error"
      } catch (error) {
        supabaseStatus = "error"
      }
    }

    // SendGrid status (based on API key presence)
    const sendgridStatus = sendgridConfig.isConfigured ? "configured" : "offline"

    const systemStatus = {
      overall: paystackStatus === "online" ? "operational" : envStatus.mode === "demo" ? "demo" : "degraded",
      mode: envStatus.mode,
      integrations: {
        paystack: {
          status: paystackStatus,
          name: "Paystack Payment Gateway",
          configured: paystackConfig.isConfigured,
          transactionCount,
          lastCheck: new Date().toISOString(),
        },
        supabase: {
          status: supabaseStatus,
          name: "Supabase Database",
          configured: supabaseConfig.isConfigured,
          lastCheck: new Date().toISOString(),
        },
        sendgrid: {
          status: sendgridStatus,
          name: "SendGrid Email Service",
          configured: sendgridConfig.isConfigured,
          lastCheck: new Date().toISOString(),
        },
      },
      environment: {
        valid: envStatus.isValid,
        mode: envStatus.mode,
        nodeEnv: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
      ai_systems: {
        neural_commerce: paystackStatus === "online" ? "active" : "learning",
        affiliate_ai: "learning", // Will be active when affiliate APIs are added
        quantum_core: paystackStatus === "online" ? "active" : "initializing",
      },
    }

    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error("AI Comprehensive Status API error:", error)
    return NextResponse.json(
      {
        overall: "error",
        mode: "error",
        error: "Failed to check comprehensive system status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
