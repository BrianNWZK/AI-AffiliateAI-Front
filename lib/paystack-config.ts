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
}

export class PaystackIntegration {
  private secretKey: string
  private publicKey: string

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || ""
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || ""
  }

  async getTransactions(perPage = 50): Promise<PaystackTransaction[]> {
    if (!this.secretKey) {
      console.error("Paystack secret key not configured")
      return []
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
        return []
      }

      const data: PaystackResponse = await response.json()
      return data.data || []
    } catch (error) {
      console.error("Paystack API fetch error:", error)
      return []
    }
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

    return revenue
  }

  async getTotalRevenue(): Promise<number> {
    const transactions = await this.getTransactions(500)
    const total = transactions
      .filter((t) => t.status === "success")
      .reduce((sum, transaction) => sum + transaction.amount / 100, 0)

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
        message: `Payment received: ₦${(transaction.amount / 100).toLocaleString()} from ${transaction.customer.email}`,
        timestamp: new Date(transaction.created_at),
        icon: "DollarSign",
        color: "text-green-400",
        amount: transaction.amount / 100,
      }))
  }
}

// Keep existing exports
export const paystackConfig = {
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
  secretKey: process.env.PAYSTACK_SECRET_KEY || "",
}
