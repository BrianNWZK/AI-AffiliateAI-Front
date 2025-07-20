import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

import type { Viewport } from "next"

export const metadata: Metadata = {
  title: "AI SaaS Dashboard - Multi-Platform Revenue Tracking",
  description:
    "Revolutionary AI-powered platform for comprehensive revenue tracking across Paystack, Stripe, Shopify, and major affiliate networks",
  keywords: "AI, SaaS, revenue tracking, Paystack, affiliate marketing, e-commerce analytics",
  authors: [{ name: "AI SaaS Team" }],
  robots: "index, follow",
  openGraph: {
    title: "AI SaaS Dashboard - Multi-Platform Revenue Tracking",
    description: "Track revenue from multiple sources with AI-powered analytics",
    type: "website",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
