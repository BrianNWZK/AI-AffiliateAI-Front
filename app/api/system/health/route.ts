import { NextResponse } from "next/server"
import { validateEnv } from "@/lib/env-config"

// Dynamically detect affiliate API keys
function getAffiliateApiKeys() {
  const env = process.env as Record<string, string>;
  return Object.keys(env).filter(
    k =>
      (k.endsWith("_API_KEY") || k.includes("AFFILIATE") || k.includes("JVZOO") || k.includes("CLICKBANK") || k.includes("CJ") || k.includes("SHAREASALE") || k.includes("AMAZON"))
      && env[k] && env[k].length > 0
  );
}

export async function GET() {
  console.log("=== SYSTEM HEALTH CHECK ===")

  try {
    const envStatus = validateEnv()
    const affiliateKeys = getAffiliateApiKeys();

    let paystackTest = {
      status: "not_configured",
      message: "Demo mode - Add PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY for real data",
      transactionCount: 0,
    }

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

    // Supabase health check (skip isReady, just confirm env vars)
    let supabaseStatus = envStatus.hasDatabase ? "configured" : "not_configured";

    // SendGrid health check: try sending a test (if TEST_EMAIL set), otherwise just check API key
    let sendgridStatus = "not_configured";
    let sendgridTestMessage = "";
    if (!isBuildTime && envStatus.hasEmail) {
      if (process.env.SENDGRID_API_KEY) {
        sendgridStatus = "configured";
        if (process.env.TEST_EMAIL) {
          try {
            const sgMail = (await import("@sendgrid/mail")).default;
            sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
            await sgMail.send({
              to: process.env.TEST_EMAIL,
              from: process.env.TEST_EMAIL,
              subject: "SendGrid Health Check",
              text: "SendGrid is working.",
            });
            sendgridStatus = "ok";
            sendgridTestMessage = "Test email sent successfully";
          } catch (err: any) {
            sendgridStatus = "error";
            sendgridTestMessage = "Failed to send test email: " + (err.message || String(err));
          }
        }
      } else {
        sendgridStatus = "not_configured";
        sendgridTestMessage = "SENDGRID_API_KEY not set";
      }
    }

    const healthReport = {
      timestamp: new Date().toISOString(),
      mode: envStatus.mode,
      buildTime: isBuildTime,
      environment: {
        ...envStatus,
        affiliateKeysDetected: affiliateKeys,
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
          testMessage: sendgridTestMessage,
        },
        auth: {
          configured: envStatus.hasAuth,
          status: envStatus.hasAuth ? "ready" : "using_fallback",
          keyPresent: !!process.env.JWT_SECRET_KEY,
        },
        affiliate: {
          configured: affiliateKeys.length > 0,
          keys: affiliateKeys,
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
          affiliate: { configured: false, status: "error" },
        },
        recommendations: [
          "🔧 Check server logs for detailed error information",
          "🚀 Add PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY to enable payments",
        ],
      },
      { status: 200 },
    )
  }
}
