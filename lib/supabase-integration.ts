import { env } from "@/lib/env-config"

export class SupabaseIntegration {
  private url: string
  private serviceRoleKey: string
  private isConfigured: boolean

  constructor() {
    this.url = env.supabase.url
    this.serviceRoleKey = env.supabase.serviceRoleKey
    this.isConfigured = !!(this.url && this.serviceRoleKey)

    if (!this.isConfigured) {
      console.log("ℹ️ Supabase not configured - using demo mode")
    }
  }

  async storeRevenue(data: {
    source: string
    amount: number
    currency: string
    metadata?: any
  }): Promise<boolean> {
    if (!this.isConfigured) {
      console.log("📊 Demo: Would store revenue:", data)
      return true
    }

    try {
      // Skip network calls during build
      if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
        console.log("🔧 Build time: Skipping Supabase call")
        return true
      }

      const response = await fetch(`${this.url}/rest/v1/revenue`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.serviceRoleKey}`,
          "Content-Type": "application/json",
          apikey: this.serviceRoleKey,
        },
        body: JSON.stringify({
          ...data,
          created_at: new Date().toISOString(),
        }),
      })

      return response.ok
    } catch (error) {
      console.warn("⚠️ Supabase store error (using fallback):", error)
      return true // Return true to not break the flow
    }
  }

  async getStoredRevenue(): Promise<any[]> {
    if (!this.isConfigured) {
      console.log("📊 Demo: Returning sample revenue data")
      return [
        {
          id: 1,
          source: "paystack",
          amount: 25000,
          currency: "NGN",
          created_at: new Date().toISOString(),
        },
      ]
    }

    try {
      // Skip network calls during build
      if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
        console.log("🔧 Build time: Returning demo revenue data")
        return []
      }

      const response = await fetch(`${this.url}/rest/v1/revenue?select=*&order=created_at.desc&limit=10`, {
        headers: {
          Authorization: `Bearer ${this.serviceRoleKey}`,
          apikey: this.serviceRoleKey,
        },
      })

      if (response.ok) {
        return await response.json()
      } else {
        console.warn("⚠️ Supabase query failed:", response.status)
        return []
      }
    } catch (error) {
      console.warn("⚠️ Supabase query error (using fallback):", error)
      return []
    }
  }

  isReady(): boolean {
    return this.isConfigured
  }
}
