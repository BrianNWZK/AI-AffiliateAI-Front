import { createClient } from "@supabase/supabase-js"
import { env } from "@/lib/env-config"

export class SupabaseIntegration {
  private supabase

  constructor() {
    if (!env.supabase.url || !env.supabase.serviceRoleKey) {
      console.warn("Supabase credentials not configured")
      this.supabase = null
      return
    }

    this.supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey)
  }

  async storeRevenue(data: {
    source: string
    amount: number
    currency: string
    reference?: string
    metadata?: any
  }) {
    if (!this.supabase) return null

    try {
      const { data: result, error } = await this.supabase.from("revenue_records").insert([
        {
          source: data.source,
          amount: data.amount,
          currency: data.currency,
          reference: data.reference,
          metadata: data.metadata,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Supabase insert error:", error)
        return null
      }

      return result
    } catch (error) {
      console.error("Supabase operation error:", error)
      return null
    }
  }

  async getStoredRevenue(days = 30) {
    if (!this.supabase) return []

    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await this.supabase
        .from("revenue_records")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase query error:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Supabase fetch error:", error)
      return []
    }
  }
}
