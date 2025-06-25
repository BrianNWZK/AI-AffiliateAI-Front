// E-commerce platform integrations
export class EcommerceIntegration {
  private tokens: { [key: string]: string }

  constructor() {
    this.tokens = {
      shopify: process.env.SHOPIFY_ACCESS_TOKEN || "",
      woocommerce: process.env.WOOCOMMERCE_API_KEY || "",
      stripe: process.env.STRIPE_SECRET_KEY || "",
    }
  }

  // Shopify Integration
  async getShopifyRevenue(): Promise<number> {
    if (!this.tokens.shopify) return 0

    try {
      const response = await fetch(`${process.env.SHOPIFY_STORE_URL}/admin/api/2023-10/orders.json`, {
        headers: {
          "X-Shopify-Access-Token": this.tokens.shopify,
        },
      })

      if (!response.ok) return 0

      const data = await response.json()
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      return (
        data.orders
          ?.filter((order: any) => {
            const orderDate = new Date(order.created_at)
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
          })
          .reduce((total: number, order: any) => total + Number.parseFloat(order.total_price), 0) || 0
      )
    } catch (error) {
      console.error("Shopify API error:", error)
      return 0
    }
  }

  // Stripe Integration
  async getStripeRevenue(): Promise<number> {
    if (!this.tokens.stripe) return 0

    try {
      const response = await fetch("https://api.stripe.com/v1/charges", {
        headers: {
          Authorization: `Bearer ${this.tokens.stripe}`,
        },
      })

      if (!response.ok) return 0

      const data = await response.json()
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      return (
        data.data
          ?.filter((charge: any) => {
            const chargeDate = new Date(charge.created * 1000)
            return (
              charge.status === "succeeded" &&
              chargeDate.getMonth() === currentMonth &&
              chargeDate.getFullYear() === currentYear
            )
          })
          .reduce((total: number, charge: any) => total + charge.amount / 100, 0) || 0
      )
    } catch (error) {
      console.error("Stripe API error:", error)
      return 0
    }
  }

  async getTotalEcommerceRevenue(): Promise<number> {
    const [shopify, stripe] = await Promise.all([this.getShopifyRevenue(), this.getStripeRevenue()])

    return shopify + stripe
  }
}
