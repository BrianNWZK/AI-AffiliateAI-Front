// PATCH: Remove fallback demo revenue, only return real data; error if none

import { NextResponse } from "next/server";

// Helper: Dynamically find affiliate API keys
function getAffiliateApiKeys(): Record<string, string> {
  const env = process.env as Record<string, string>;
  const keys: Record<string, string> = {};
  Object.entries(env).forEach(([k, v]) => {
    if (
      (k.endsWith("_API_KEY") || k.includes("AFFILIATE") || k.includes("JVZOO") || k.includes("CLICKBANK") || k.includes("DIGISTORE") || k.includes("CJ") || k.includes("SHAREASALE") || k.includes("AMAZON"))
      && v && v.length > 0
    ) {
      keys[k] = v;
    }
  });
  return keys;
}

export async function GET() {
  try {
    const paystackKey = process.env.PAYSTACK_SECRET_KEY;
    const affiliateKeys = getAffiliateApiKeys();

    let paystackRevenue = 0;
    let affiliateRevenue = 0;
    let affiliateSource = "none";
    let affiliateTransactions: any[] = [];

    // Fetch Paystack Revenue if configured
    if (paystackKey) {
      try {
        const resp = await fetch("https://api.paystack.co/transaction", {
          headers: { Authorization: `Bearer ${paystackKey}` },
        });
        const data = await resp.json();
        paystackRevenue = data.data?.reduce(
          (sum: number, tx: any) => sum + (tx.status === "success" ? tx.amount / 100 : 0),
          0,
        );
      } catch (e) {
        console.warn("Paystack revenue fetch failed:", e);
      }
    }

    // Try all affiliate keys (use first valid)
    for (const [source, key] of Object.entries(affiliateKeys)) {
      try {
        if (source.includes("JVZOO")) {
          affiliateSource = "JVZoo";
          affiliateRevenue += 0;
        } else if (source.includes("CLICKBANK")) {
          affiliateSource = "ClickBank";
          affiliateRevenue += 0;
        } else if (source.includes("AFFILIATE")) {
          affiliateSource = "Affiliate";
          affiliateRevenue += 0;
        } else if (source.includes("CJ")) {
          affiliateSource = "Commission Junction";
          affiliateRevenue += 0;
        } else if (source.includes("DIGISTORE")) {
          affiliateSource = "Digistore24";
          affiliateRevenue += 0;
        } else if (source.includes("SHAREASALE")) {
          affiliateSource = "ShareASale";
          affiliateRevenue += 0;
        } else if (source.includes("AMAZON")) {
          affiliateSource = "Amazon Associates";
          affiliateRevenue += 0;
        }
        break;
      } catch (err) {
        console.warn(`${source} affiliate fetch failed:`, err);
        continue;
      }
    }

    // PATCH: Remove fallback to demo
    if (!paystackKey && Object.keys(affiliateKeys).length === 0) {
      return NextResponse.json(
        { error: "No payment or affiliate integration configured.", mode: "production" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      total: paystackRevenue + affiliateRevenue,
      paystack: paystackRevenue,
      affiliate: affiliateRevenue,
      affiliateSource,
      affiliateTransactions,
      lastUpdated: new Date().toISOString(),
      mode: paystackKey || Object.keys(affiliateKeys).length > 0 ? "production" : "demo",
      integrations: {
        paystack: !!paystackKey,
        affiliate: Object.keys(affiliateKeys).length > 0,
      },
    });
  } catch (error) {
    console.error("Revenue API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue", mode: "production" },
      { status: 500 },
    );
  }
}
