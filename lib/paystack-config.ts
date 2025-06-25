// ✅ Safe to have public key in frontend code
export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_your_public_key_here",
  currency: "NGN", // or USD
  channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
}

// This will be visible in browser - that's normal and safe!
