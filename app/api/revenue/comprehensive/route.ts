import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { search } = new URL(request.url)
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/proxy/api/v1/paystack/revenue/all${search}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: request.headers.get('Authorization') || '',
    },
  })
}
