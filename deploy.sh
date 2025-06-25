#!/bin/bash

echo "🚀 Deploying AI SaaS to Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "Checking Vercel authentication..."
vercel whoami || vercel login

# Deploy to production
echo "Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Go to Vercel Dashboard"
echo "2. Navigate to your project settings"
echo "3. Add environment variables:"
echo "   - PAYSTACK_SECRET_KEY"
echo "   - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
echo "   - SHOPIFY_ACCESS_TOKEN (optional)"
echo "   - STRIPE_SECRET_KEY (optional)"
echo "   - CJ_API_KEY (optional)"
echo "   - AMAZON_ASSOCIATES_KEY (optional)"
echo "   - CLICKBANK_API_KEY (optional)"
echo "4. Redeploy after adding environment variables"
echo ""
echo "🌐 Your SaaS will be live at the provided URL!"
