import { NextResponse } from "next/server"
const BACKEND_URL = "https://ai-affiliate-backend.onrender.com/ariel/status"

export async function GET() {
  try {
    const resp = await fetch(BACKEND_URL)
    if (!resp.ok) throw new Error(`Backend error: ${resp.status}`)
    const data = await resp.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Ariel status API error:", error)
    return NextResponse.json({ running: false, lastActive: null }, { status: 503 })
  }
}
