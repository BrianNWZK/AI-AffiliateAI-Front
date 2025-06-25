# For Render.com deployment (based on your render.yaml)

# In Render Dashboard, add these as Environment Variables:
PAYSTACK_SECRET_KEY=sk_live_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key
SHOPIFY_ACCESS_TOKEN=your_shopify_token
AFFILIATE_API_KEY=your_affiliate_key
NODE_ENV=production

# For local development, keep in .env.local:
PAYSTACK_SECRET_KEY=sk_test_your_test_key
PAYSTACK_PUBLIC_KEY=pk_test_your_test_key
SHOPIFY_ACCESS_TOKEN=your_dev_token
AFFILIATE_API_KEY=your_dev_key
NODE_ENV=development
