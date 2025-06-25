import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { reference } = await request.json()

  // 🚨 Secret key used server-side only - NEVER expose this
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Server-side only!
    },
  })

  const data = await response.json()

  if (data.status && data.data.status === "success") {
    // Payment verified - update your database
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false }, { status: 400 })
}
