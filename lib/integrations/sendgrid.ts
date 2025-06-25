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
              subject: `New Revenue Alert: ₦${data.amount.toLocaleString()}`,
            },
          ],
          from: { email: "alerts@yoursaas.com", name: "AI SaaS Dashboard" },
          content: [
            {
              type: "text/html",
              value: `
              <h2>New Revenue Received!</h2>
              <p><strong>Amount:</strong> ₦${data.amount.toLocaleString()}</p>
              <p><strong>Source:</strong> ${data.source}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            `,
            },
          ],
        }),
      })

      return response.ok
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
              <h2>${data.subject}</h2>
              <p>${data.message}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
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
}
