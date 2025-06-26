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
    let affiliateDemo = false;
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
        // Example: JVZoo, ClickBank, Digistore24, etc. (pseudo-code: replace with real fetch logic for each API)
        if (source.includes("JVZOO")) {
          // Replace the below with the real JVZoo API call
          // const resp = await fetch("https://api.jvzoo.com/transactions", { headers: { Authorization: key } });
          // const data = await resp.json();
          // affiliateRevenue = ...;
          // affiliateTransactions = ...;
          affiliateSource = "JVZoo";
          // For now, just mark as detected
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
        // If you want to run all, do not break here
        break;
      } catch (err) {
        console.warn(`${source} affiliate fetch failed:`, err);
        continue;
      }
    }

    // Fallback to demo only if nothing configured
    if (!paystackKey && Object.keys(affiliateKeys).length === 0) {
      affiliateDemo = true;
      affiliateRevenue = 25000;
      affiliateSource = "demo";
    }

    return NextResponse.json({
      total: paystackRevenue + affiliateRevenue,
      paystack: paystackRevenue,
      affiliate: affiliateRevenue,
      affiliateSource,
      affiliateDemo,
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
      { error: "Failed to fetch revenue", mode: "demo" },
      { status: 500 },
    );
  }
}
