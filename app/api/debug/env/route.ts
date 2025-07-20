import { NextResponse } from "next/server"

export async function GET() {
  try {
    const envVars = {
      PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY ? "SET" : "NOT SET",
      PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY ? "SET" : "NOT SET",
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? "SET" : "NOT SET",
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "SET" : "NOT SET",
      SUPABASE_URL: process.env.SUPABASE_URL ? "SET" : "NOT SET",
      BACKEND_URL: process.env.BACKEND_URL ? "SET" : "NOT SET",
    }
    return NextResponse.json(envVars)
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: "Failed to fetch env vars" }, { status: 500 })
  }
}
