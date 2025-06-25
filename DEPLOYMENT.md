# Deployment to Vercel

## 1. Install Vercel CLI
\`\`\`bash
npm i -g vercel
\`\`\`

## 2. Login to Vercel
\`\`\`bash
vercel login
\`\`\`

## 3. Deploy
\`\`\`bash
vercel --prod
\`\`\`

## 4. Environment Variables to Add in Vercel Dashboard

### Required for Real Revenue Data:
- `PAYSTACK_SECRET_KEY` - Your Paystack secret key (sk_live_...)
- `PAYSTACK_PUBLIC_KEY` - Your Paystack public key (pk_live_...)
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Same as above (for frontend)

### Optional for Extended Features:
- `AFFILIATE_API_KEY` - Your affiliate network API key
- `SHOPIFY_ACCESS_TOKEN` - If using Shopify integration
- `DATABASE_URL` - If you add database storage later

## 5. After Deployment:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the required keys
5. Redeploy to apply changes

## 6. Testing:
- Visit your deployed URL
- Check if revenue data loads (will be 0 initially)
- Verify AI status shows "active" for configured services
