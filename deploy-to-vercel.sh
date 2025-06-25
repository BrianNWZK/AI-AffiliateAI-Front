#!/bin/bash

echo "🚀 Deploying AI SaaS to Vercel..."
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed successfully!"
fi

# Check authentication
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

echo "👤 Logged in as: $(vercel whoami)"

# Build and deploy
echo "🏗️  Building and deploying to production..."
echo ""

# Deploy with production flag
vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo "=================================="
echo ""
echo "🔧 NEXT STEPS - Add Environment Variables:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings > Environment Variables"
echo "4. Add these variables:"
echo ""
echo "   🔑 REQUIRED (for basic functionality):"
echo "   ├── PAYSTACK_SECRET_KEY=sk_live_your_secret_key"
echo "   └── NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_public_key"
echo ""
echo "   💰 OPTIONAL (for additional revenue streams):"
echo "   ├── STRIPE_SECRET_KEY=sk_live_your_stripe_key"
echo "   ├── SHOPIFY_ACCESS_TOKEN=your_shopify_token"
echo "   ├── SHOPIFY_STORE_URL=https://your-store.myshopify.com"
echo "   ├── CJ_API_KEY=your_cj_api_key"
echo "   ├── AMAZON_ASSOCIATES_KEY=your_amazon_key"
echo "   ├── CLICKBANK_API_KEY=your_clickbank_key"
echo "   ├── SHAREASALE_API_KEY=your_shareasale_key"
echo "   ├── WOOCOMMERCE_API_KEY=your_woocommerce_key"
echo "   ├── GOOGLE_ANALYTICS_KEY=your_ga_key"
echo "   ├── GA_VIEW_ID=your_ga_view_id"
echo "   ├── FACEBOOK_PIXEL_TOKEN=your_fb_token"
echo "   └── MIXPANEL_TOKEN=your_mixpanel_token"
echo ""
echo "5. After adding variables, redeploy:"
echo "   vercel --prod"
echo ""
echo "🌐 Your AI SaaS is now live!"
echo "📊 Dashboard will show real data once you add your API keys"
echo ""
