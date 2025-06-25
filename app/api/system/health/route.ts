import { NextResponse } from "next/server"
import { validateEnv } from "@/lib/env-config"

export async function GET() {
  console.log("=== SYSTEM HEALTH CHECK ===")

  try {
    // Get environment status (this won't throw errors now)
    const envStatus = validateEnv()

    // Initialize service status
    let paystackTest = {
      status: "not_configured",
      message: "Demo mode - Add PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY for real data",
      transactionCount: 0,
    }

    // Only test Paystack if configured AND not during build
    const isBuildTime = process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV

    if (envStatus.hasPaystack && !isBuildTime) {
      try {
        console.log("🔍 Testing Paystack connection...")

        const response = await fetch("https://api.paystack.co/transaction?perPage=5", {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          paystackTest = {
            status: "connected",
            message: `Successfully connected to Paystack API`,
            transactionCount: data.data?.length || 0,
          }
          console.log(`✅ Paystack test successful: ${data.data?.length || 0} transactions found`)
        } else {
          paystackTest = {
            status: "error",
            message: `API returned status ${response.status}`,
            transactionCount: 0,
          }
        }
      } catch (error) {
        console.error("❌ Paystack test failed:", error)
        paystackTest = {
          status: "error",
          message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
          transactionCount: 0,
        }
      }
    } else if (isBuildTime) {
      console.log("🔧 Build time: Skipping network tests")
      paystackTest = {
        status: envStatus.hasPaystack ? "configured" : "not_configured",
        message: envStatus.hasPaystack ? "Configured (not tested during build)" : "Not configured",
        transactionCount: 0,
      }
    }

    // Test other services safely (skip during build)
    let supabaseStatus = "not_configured"
    let sendgridStatus = "not_configured"

    if (!isBuildTime) {
      if (envStatus.hasDatabase) {
        try {
          const { SupabaseIntegration } = await import("@/lib/supabase-integration")
          const supabase = new SupabaseIntegration()
          supabaseStatus = supabase.isReady() ? "ready" : "error"
        } catch (error) {
          console.warn("⚠️ Supabase test skipped:", error)
          supabaseStatus = "error"
        }
      }

      if (envStatus.hasEmail) {
        try {
          const { SendGridIntegration } = await import("@/lib/sendgrid-integration")
          const sendgrid = new SendGridIntegration()
          sendgridStatus = sendgrid.isReady() ? "ready" : "error"
        } catch (error) {
          console.warn("⚠️ SendGrid test skipped:", error)
          sendgridStatus = "error"
        }
      }
    } else {
      supabaseStatus = envStatus.hasDatabase ? "configured" : "not_configured"
      sendgridStatus = envStatus.hasEmail ? "configured" : "not_configured"
    }

    const healthReport = {
      timestamp: new Date().toISOString(),
      mode: envStatus.mode,
      buildTime: isBuildTime,
      environment: {
        ...envStatus,
        nodeEnv: process.env.NODE_ENV || "development",
        vercelEnv: process.env.VERCEL_ENV || "development",
      },
      services: {
        paystack: {
          configured: envStatus.hasPaystack,
          status: envStatus.hasPaystack
            ? paystackTest.status === "connected"
              ? "connected"
              : paystackTest.status === "configured"
                ? "configured"
                : "error"
            : "not_configured",
          test: paystackTest,
          publicKeyPresent: !!process.env.PAYSTACK_PUBLIC_KEY,
          secretKeyPresent: !!process.env.PAYSTACK_SECRET_KEY,
        },
        supabase: {
          configured: envStatus.hasDatabase,
          status: supabaseStatus,
          urlPresent: !!process.env.SUPABASE_URL,
          keyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
        sendgrid: {
          configured: envStatus.hasEmail,
          status: sendgridStatus,
          keyPresent: !!process.env.SENDGRID_API_KEY,
        },
        auth: {
          configured: envStatus.hasAuth,
          status: envStatus.hasAuth ? "ready" : "using_fallback",
          keyPresent: !!process.env.JWT_SECRET_KEY,
        },
      },
      recommendations: [
        ...(envStatus.mode === "demo"
          ? [
              "🚀 Add PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY in Vercel dashboard to enable real payments",
              "💡 Get your Paystack keys from: https://dashboard.paystack.com/#/settings/developer",
            ]
          : []),
        ...(envStatus.optional.length > 0 ? [`Optional: ${envStatus.optional.join(", ")}`] : []),
        ...(paystackTest.status === "connected" && paystackTest.transactionCount === 0
          ? ["ℹ️ No transactions found - this is normal for new accounts"]
          : []),
        ...(isBuildTime ? ["ℹ️ Network tests skipped during build - will test at runtime"] : []),
      ],
    }

    console.log("=== HEALTH CHECK COMPLETE ===")
    console.log(`Status: ${envStatus.mode} mode${isBuildTime ? " (build time)" : ""}`)

    return NextResponse.json(healthReport)
  } catch (error) {
    console.error("❌ Health check failed:", error)

    // Even if health check fails, return a graceful response
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        mode: "error",
        error: "Health check failed",
        message: error instanceof Error ? error.message : String(error),
        environment: {
          isValid: false,
          status: "error",
          nodeEnv: process.env.NODE_ENV || "development",
        },
        services: {
          paystack: { configured: false, status: "error" },
          supabase: { configured: false, status: "error" },
          sendgrid: { configured: false, status: "error" },
          auth: { configured: false, status: "error" },
        },
        recommendations: [
          "🔧 Check server logs for detailed error information",
          "🚀 Add PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY to enable payments",
        ],
      },
      { status: 200 }, // Return 200 even on error so dashboard can display the info
    )
  }
}
