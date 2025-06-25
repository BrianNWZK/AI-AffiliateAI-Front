import { env } from "@/lib/env-config"

export class SendGridIntegration {
  private apiKey: string

  constructor() {
    this.apiKey = env.sendgrid.apiKey
  }

  async sendRevenueAlert(data: {
    to: string
    amount: number
    source: string
  }) {
    if (!this.apiKey) {
      console.warn("SendGrid API key not configured")
      return false
    }

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: data.to }],
              subject: `🎉 New Revenue Alert: ₦${data.amount.toLocaleString()}`,
            },
          ],
          from: { email: "alerts@yoursaas.com", name: "AI SaaS Dashboard" },
          content: [
            {
              type: "text/html",
              value: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #10b981;">💰 New Revenue Received!</h2>
                  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Amount:</strong> <span style="color: #10b981; font-size: 24px;">₦${data.amount.toLocaleString()}</span></p>
                    <p><strong>Source:</strong> ${data.source}</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                  </div>
                  <p style="color: #6b7280;">This is an automated alert from your AI SaaS Dashboard.</p>
                </div>
              `,
            },
          ],
        }),
      })

      if (response.ok) {
        console.log(`Revenue alert sent successfully to ${data.to}`)
        return true
      } else {
        console.error("SendGrid API error:", response.status, response.statusText)
        return false
      }
    } catch (error) {
      console.error("SendGrid email error:", error)
      return false
    }
  }

  async sendSystemAlert(data: {
    to: string
    subject: string
    message: string
  }) {
    if (!this.apiKey) return false

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: data.to }],
              subject: data.subject,
            },
          ],
          from: { email: "system@yoursaas.com", name: "AI SaaS System" },
          content: [
            {
              type: "text/html",
              value: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #3b82f6;">${data.subject}</h2>
                  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p>${data.message}</p>
                  </div>
                  <p style="color: #6b7280;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px;">AI SaaS Dashboard System Alert</p>
                </div>
              `,
            },
          ],
        }),
      })

      return response.ok
    } catch (error) {
      console.error("SendGrid system alert error:", error)
      return false
    }
  }

  async sendDailyReport(data: {
    to: string
    totalRevenue: number
    todayRevenue: number
    transactionCount: number
  }) {
    if (!this.apiKey) return false

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: data.to }],
              subject: `📊 Daily Revenue Report - ${new Date().toLocaleDateString()}`,
            },
          ],
          from: { email: "reports@yoursaas.com", name: "AI SaaS Reports" },
          content: [
            {
              type: "text/html",
              value: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1f2937;">📊 Daily Revenue Report</h2>
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Today's Performance</h3>
                    <p><strong>Today's Revenue:</strong> ₦${data.todayRevenue.toLocaleString()}</p>
                    <p><strong>Total Revenue:</strong> ₦${data.totalRevenue.toLocaleString()}</p>
                    <p><strong>Transactions:</strong> ${data.transactionCount}</p>
                  </div>
                  <p style="color: #6b7280;">Generated on ${new Date().toLocaleString()}</p>
                </div>
              `,
            },
          ],
        }),
      })

      return response.ok
    } catch (error) {
      console.error("SendGrid daily report error:", error)
      return false
    }
  }
}
