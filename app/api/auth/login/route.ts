import { type NextRequest, NextResponse } from "next/server"
import { signJWT } from "@/lib/jwt"
import { SendGridIntegration } from "@/lib/sendgrid-integration"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple authentication (replace with your actual auth logic)
    if (email === "admin@yoursaas.com" && password === "your-secure-password") {
      const token = await signJWT({
        email,
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
      })

      // Send login notification
      const sendgrid = new SendGridIntegration()
      await sendgrid.sendSystemAlert({
        to: email,
        subject: "🔐 Login Alert - AI SaaS Dashboard",
        message: `Successful login to your AI SaaS Dashboard at ${new Date().toLocaleString()}. If this wasn't you, please secure your account immediately.`,
      })

      return NextResponse.json({
        success: true,
        token,
        user: { email, role: "admin" },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 })
  }
}
