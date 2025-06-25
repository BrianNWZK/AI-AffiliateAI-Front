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

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || ""
  }

  async getTransactions(perPage = 50): Promise<PaystackTransaction[]> {
    if (!this.secretKey) {
      throw new Error("Paystack secret key not configured")
    }

    const response = await fetch(`https://api.paystack.co/transaction?perPage=${perPage}`, {
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.status}`)
    }

    const data: PaystackResponse = await response.json()
    return data.data || []
  }

  async getMonthlyRevenue(month?: number, year?: number): Promise<number> {
    const transactions = await this.getTransactions(200)
    const targetMonth = month ?? new Date().getMonth()
    const targetYear = year ?? new Date().getFullYear()

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.created_at)
        return (
          transaction.status === "success" &&
          transactionDate.getMonth() === targetMonth &&
          transactionDate.getFullYear() === targetYear
        )
      })
      .reduce((total, transaction) => total + transaction.amount / 100, 0)
  }

  async verifyTransaction(reference: string): Promise<boolean> {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    })

    if (!response.ok) return false

    const data = await response.json()
    return data.status && data.data.status === "success"
  }

  async getRecentActivities(limit = 10): Promise<any[]> {
    const transactions = await this.getTransactions(limit)

    return transactions
      .filter((t) => t.status === "success")
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
