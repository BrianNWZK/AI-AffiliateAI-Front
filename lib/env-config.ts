// Environment configuration with graceful handling
export const env = {
  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },

  // Email
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || "",
  },

  // Paystack (using your EXACT variable names from Vercel)
  paystack: {
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
    secretKey: process.env.PAYSTACK_SECRET_KEY || "",
  },

  // Auth
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || "fallback-secret-key-for-development",
    expireMinutes: 1440, // 24 hours
  },
}

// Graceful validation function that doesn't throw errors
export function validateEnv() {
  const missing = []
  const warnings = []
  const optional = []

  // Check Paystack (critical for payment processing)
  if (!env.paystack.secretKey) missing.push("PAYSTACK_SECRET_KEY")
  if (!env.paystack.publicKey) missing.push("PAYSTACK_PUBLIC_KEY")

  // Check optional services
  if (!env.jwt.secretKey || env.jwt.secretKey === "fallback-secret-key-for-development") {
    optional.push("JWT_SECRET_KEY (using fallback)")
  }
  if (!env.sendgrid.apiKey) optional.push("SENDGRID_API_KEY")
  if (!env.supabase.url) optional.push("SUPABASE_URL")
  if (!env.supabase.serviceRoleKey) optional.push("SUPABASE_SERVICE_ROLE_KEY")

  // Determine overall status
  const hasPaystack = !!(env.paystack.secretKey && env.paystack.publicKey)
  const isValid = hasPaystack // Only require Paystack for "valid" status
  const mode = hasPaystack ? "production" : "demo"

  // Log status (but don't throw errors)
  console.log(`🔧 Environment Mode: ${mode.toUpperCase()}`)
  console.log("📋 Environment Variables Status:")
  console.log(`  - PAYSTACK_SECRET_KEY: ${env.paystack.secretKey ? "✅ Present" : "❌ Missing (Demo Mode)"}`)
  console.log(`  - PAYSTACK_PUBLIC_KEY: ${env.paystack.publicKey ? "✅ Present" : "❌ Missing (Demo Mode)"}`)
  console.log(
    `  - JWT_SECRET_KEY: ${env.jwt.secretKey && env.jwt.secretKey !== "fallback-secret-key-for-development" ? "✅ Present" : "⚠️ Using Fallback"}`,
  )
  console.log(`  - SENDGRID_API_KEY: ${env.sendgrid.apiKey ? "✅ Present" : "⚠️ Optional"}`)
  console.log(`  - SUPABASE_URL: ${env.supabase.url ? "✅ Present" : "⚠️ Optional"}`)

  if (missing.length > 0) {
    console.log(`ℹ️ Demo Mode: Missing ${missing.join(", ")} - Using demo data`)
  } else {
    console.log("✅ Production Mode: All payment systems connected")
  }

  return {
    isValid,
    mode,
    missing,
    warnings,
    optional,
    hasPaystack,
    hasAuth: !!env.jwt.secretKey,
    hasEmail: !!env.sendgrid.apiKey,
    hasDatabase: !!(env.supabase.url && env.supabase.serviceRoleKey),
    canProcessPayments: hasPaystack,
    status: hasPaystack ? "production" : "demo",
  }
}

// Safe getter functions that never throw
export function getPaystackConfig() {
  return {
    publicKey: env.paystack.publicKey,
    secretKey: env.paystack.secretKey,
    isConfigured: !!(env.paystack.publicKey && env.paystack.secretKey),
  }
}

export function getSupabaseConfig() {
  return {
    url: env.supabase.url,
    serviceRoleKey: env.supabase.serviceRoleKey,
    isConfigured: !!(env.supabase.url && env.supabase.serviceRoleKey),
  }
}

export function getSendGridConfig() {
  return {
    apiKey: env.sendgrid.apiKey,
    isConfigured: !!env.sendgrid.apiKey,
  }
}

export function getJWTConfig() {
  return {
    secretKey: env.jwt.secretKey,
    expireMinutes: env.jwt.expireMinutes,
    isConfigured: !!(env.jwt.secretKey && env.jwt.secretKey !== "fallback-secret-key-for-development"),
  }
}
