import { NextResponse } from "next/server"
const BACKEND_URL = "https://ai-affiliate-backend.onrender.com/api/v1/ariel/logs"

export async function GET() {
  try {
    const resp = await fetch(BACKEND_URL)
    if (!resp.ok) throw new Error(`Backend error: ${resp.status}`)
    const data = await resp.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Quantum logs API error:", error)
    return NextResponse.json({ logs: ["No logs available."] }, { status: 503 })
  }
}
