// Validate environment variables safely
export function validateEnvVars() {
  const requiredVars = ["PAYSTACK_SECRET_KEY", "PAYSTACK_PUBLIC_KEY", "SHOPIFY_ACCESS_TOKEN", "AFFILIATE_API_KEY"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return {
    paystackSecret: process.env.PAYSTACK_SECRET_KEY!,
    paystackPublic: process.env.PAYSTACK_PUBLIC_KEY!,
    shopifyToken: process.env.SHOPIFY_ACCESS_TOKEN!,
    affiliateKey: process.env.AFFILIATE_API_KEY!,
  }
}
