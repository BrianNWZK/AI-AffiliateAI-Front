// Environment configuration that matches your actual keys
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

  // Paystack (note: using your exact variable names)
  paystack: {
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
    secretKey: process.env.PAYSTACK_SECRET_KEY || "",
  },

  // Auth
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || "",
    expireMinutes: 1440, // 24 hours
  },
}

// Validation function
export function validateEnv() {
  const missing = []

  if (!env.paystack.secretKey) missing.push("PAYSTACK_SECRET_KEY")
  if (!env.paystack.publicKey) missing.push("PAYSTACK_PUBLIC_KEY")
  if (!env.jwt.secretKey) missing.push("JWT_SECRET_KEY")

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`)
  }

  return missing.length === 0
}
