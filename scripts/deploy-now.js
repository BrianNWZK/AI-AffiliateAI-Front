const { execSync } = require("child_process")
const fs = require("fs")

console.log("🚀 Starting AI SaaS Deployment to Vercel...")
console.log("================================================")

// Check if we're in the right environment
if (typeof process === "undefined") {
  console.error("❌ This script needs to run in a Node.js environment")
  process.exit(1)
}

try {
  // Step 1: Check Vercel CLI
  console.log("📦 Checking Vercel CLI...")
  try {
    execSync("vercel --version", { stdio: "pipe" })
    console.log("✅ Vercel CLI found")
  } catch (error) {
    console.log("📥 Installing Vercel CLI...")
    execSync("npm install -g vercel", { stdio: "inherit" })
    console.log("✅ Vercel CLI installed")
  }

  // Step 2: Check authentication
  console.log("🔐 Checking Vercel authentication...")
  try {
    const whoami = execSync("vercel whoami", { encoding: "utf8", stdio: "pipe" })
    console.log(`✅ Logged in as: ${whoami.trim()}`)
  } catch (error) {
    console.log("🔑 Please login to Vercel...")
    execSync("vercel login", { stdio: "inherit" })
  }

  // Step 3: Deploy to production
  console.log("🏗️  Deploying to Vercel production...")
  console.log("This may take a few minutes...")

  const deployOutput = execSync("vercel --prod --yes", {
    encoding: "utf8",
    stdio: "pipe",
  })

  // Extract URL from output
  const urlMatch = deployOutput.match(/https:\/\/[^\s]+/)
  const deployUrl = urlMatch ? urlMatch[0] : "Check Vercel dashboard for URL"

  console.log("")
  console.log("🎉 DEPLOYMENT SUCCESSFUL!")
  console.log("========================")
  console.log("")
  console.log(`🌐 Your AI SaaS is live at: ${deployUrl}`)
  console.log("")
  console.log("🔧 NEXT STEPS:")
  console.log("1. Go to: https://vercel.com/dashboard")
  console.log("2. Select your project")
  console.log("3. Go to Settings > Environment Variables")
  console.log("4. Add these essential variables:")
  console.log("")
  console.log("   🔑 REQUIRED:")
  console.log("   ├── PAYSTACK_SECRET_KEY=sk_live_your_secret_key")
  console.log("   └── NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_public_key")
  console.log("")
  console.log("   💰 OPTIONAL (add as needed):")
  console.log("   ├── STRIPE_SECRET_KEY=sk_live_your_stripe_key")
  console.log("   ├── SHOPIFY_ACCESS_TOKEN=your_shopify_token")
  console.log("   ├── CJ_API_KEY=your_cj_api_key")
  console.log("   ├── AMAZON_ASSOCIATES_KEY=your_amazon_key")
  console.log("   └── CLICKBANK_API_KEY=your_clickbank_key")
  console.log("")
  console.log("5. After adding variables, redeploy:")
  console.log("   vercel --prod")
  console.log("")
  console.log("📊 Your dashboard will show real revenue data once API keys are configured!")
  console.log("")
} catch (error) {
  console.error("❌ Deployment failed:", error.message)
  console.log("")
  console.log("🔧 Troubleshooting:")
  console.log("1. Make sure you have Node.js installed")
  console.log("2. Check your internet connection")
  console.log("3. Verify Vercel account permissions")
  console.log("4. Try running: npm install -g vercel")
  process.exit(1)
}
