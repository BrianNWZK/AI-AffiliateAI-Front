import { NextResponse } from "next/server"
const BACKEND_URL = "https://ai-affiliate-backend.onrender.com/quantum/optimize"

export async function POST(request: Request) {
  try {
    // Forward the request body to the backend if needed
    const body = await request.text()
    const resp = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    })
    const data = await resp.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to optimize Quantum", details: error?.toString() },
      { status: 500 }
    )
  }
}
