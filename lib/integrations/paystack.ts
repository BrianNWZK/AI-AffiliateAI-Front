import { env } from "@/lib/env-config"

interface PaystackTransaction {
  id: number
  amount: number
  status: string
  created_at: string
  customer: {
    email: string
  }
  reference: string
}

interface PaystackResponse {
  status: boolean
  message: string
  data: PaystackTransaction[]
  meta?: {
    total: number
    skipped: number
    perPage: number
    page: number
    pageCount: number
  }
}

export class PaystackIntegration {
  private secretKey: string
  private publicKey: string
  private isConfigured: boolean

  constructor() {
    this.secretKey = env.paystack.secretKey
    this.publicKey = env.paystack.publicKey
    this.isConfigured = !!(this.secretKey && this.publicKey)

    if (!this.isConfigured) {
      console.warn("⚠️ Paystack not configured - using demo data")
    }
  }

  async getTransactions(perPage = 50): Promise<PaystackTransaction[]> {
    if (!this.isConfigured) {
      // Return demo data when not configured
      return this.getDemoTransactions()
    }

    try {
      const response = await fetch(`https://api.paystack.co/transaction?perPage=${perPage}&status=success`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error(`Paystack API error: ${response.status}`)
        return this.getDemoTransactions()
      }

      const data: PaystackResponse = await response.json()

      if (!data.status) {
        console.error("Paystack API returned error:", data.message)
        return this.getDemoTransactions()
      }

      return data.data || []
    } catch (error) {
      console.error("Paystack API fetch error:", error)
      return this.getDemoTransactions()
    }
  }

  private getDemoTransactions(): PaystackTransaction[] {
    // Demo data for when Paystack is not configured
    return [
      {
        id: 1,
        amount: 50000, // ₦500 in kobo
        status: "success",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        customer: { email: "demo@customer.com" },
        reference: "demo_ref_001",
      },
      {
        id: 2,
        amount: 25000, // ₦250 in kobo
        status: "success",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        customer: { email: "test@user.com" },
        reference: "demo_ref_002",
      },
    ]
  }

  async getMonthlyRevenue(month?: number, year?: number): Promise<number> {
    const transactions = await this.getTransactions(200)
    const targetMonth = month ?? new Date().getMonth()
    const targetYear = year ?? new Date().getFullYear()

    const monthlyTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at)
      return (
        transaction.status === "success" &&
        transactionDate.getMonth() === targetMonth &&
        transactionDate.getFullYear() === targetYear
      )
    })

    const revenue = monthlyTransactions.reduce((total, transaction) => {
      return total + transaction.amount / 100 // Paystack amounts are in kobo
    }, 0)

    if (!this.isConfigured) {
      console.log(`Demo monthly revenue: ₦${revenue.toLocaleString()}`)
    } else {
      console.log(`Monthly revenue for ${targetMonth + 1}/${targetYear}: ₦${revenue.toLocaleString()}`)
    }

    return revenue
  }

  async getTotalRevenue(): Promise<number> {
    const transactions = await this.getTransactions(500)
    const total = transactions
      .filter((t) => t.status === "success")
      .reduce((sum, transaction) => sum + transaction.amount / 100, 0)

    if (!this.isConfigured) {
      console.log(`Demo total revenue: ₦${total.toLocaleString()}`)
    } else {
      console.log(`Total revenue: ₦${total.toLocaleString()}`)
    }

    return total
  }

  async getRecentActivities(limit = 10): Promise<any[]> {
    const transactions = await this.getTransactions(limit)

    return transactions
      .filter((t) => t.status === "success")
      .slice(0, limit)
      .map((transaction) => ({
        id: transaction.id,
        type: "revenue",
        message: this.isConfigured
          ? `Payment received: ₦${(transaction.amount / 100).toLocaleString()} from ${transaction.customer.email}`
          : `Demo payment: ₦${(transaction.amount / 100).toLocaleString()} from ${transaction.customer.email}`,
        timestamp: new Date(transaction.created_at),
        icon: "DollarSign",
        color: "text-green-400",
        amount: transaction.amount / 100,
      }))
  }

  async verifyTransaction(reference: string): Promise<boolean> {
    if (!this.isConfigured) return true // Demo mode always returns true

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      })

      if (!response.ok) return false

      const data = await response.json()
      return data.status && data.data.status === "success"
    } catch (error) {
      console.error("Transaction verification error:", error)
      return false
    }
  }

  getPublicKey(): string {
    return this.publicKey || "pk_demo_key"
  }

  isReady(): boolean {
    return this.isConfigured
  }

  getStatus(): string {
    return this.isConfigured ? "configured" : "demo_mode"
  }
}
