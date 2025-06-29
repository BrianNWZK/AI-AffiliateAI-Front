import { NextResponse } from "next/server"
const BACKEND_URL = "https://ai-affiliate-backend.onrender.com/ariel/optimize"

export async function POST() {
  try {
    const resp = await fetch(BACKEND_URL, { method: "POST" })
    if (!resp.ok) throw new Error(`Backend error: ${resp.status}`)
    const data = await resp.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Ariel optimize API error:", error)
    return NextResponse.json({ message: "Failed to optimize ArielAI." }, { status: 503 })
  }
}
