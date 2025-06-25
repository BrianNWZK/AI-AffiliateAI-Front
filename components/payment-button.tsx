"use client"

import { useState } from "react"

export function PaymentButton({ amount, email }: { amount: number; email: string }) {
  const [loading, setLoading] = useState(false)

  const handlePayment = () => {
    setLoading(true)

    // ✅ Using public key is safe here
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // Safe to use
      email: email,
      amount: amount * 100, // Paystack uses kobo
      currency: "NGN",
      callback: (response: any) => {
        // Payment successful - verify on backend with SECRET key
        fetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({ reference: response.reference }),
        })
      },
      onClose: () => {
        setLoading(false)
      },
    })

    handler.openIframe()
  }

  return (
    <button onClick={handlePayment} disabled={loading} className="quantum-button">
      {loading ? "Processing..." : `Pay ₦${amount}`}
    </button>
  )
}
