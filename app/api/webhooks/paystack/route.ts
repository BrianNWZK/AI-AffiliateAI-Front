import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
      .update(body)
      .digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle different webhook events
    switch (event.event) {
      case "charge.success":
        await handleSuccessfulPayment(event.data)
        break
      case "transfer.success":
        await handleSuccessfulTransfer(event.data)
        break
      default:
        console.log(`Unhandled event: ${event.event}`)
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleSuccessfulPayment(data: any) {
  // Handle successful payment
  console.log("Payment successful:", data.reference, data.amount / 100)

  // You can add database logging, notifications, etc. here
  // For now, we'll just log it
}

async function handleSuccessfulTransfer(data: any) {
  // Handle successful transfer
  console.log("Transfer successful:", data.reference, data.amount / 100)
}
