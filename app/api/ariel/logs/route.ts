import { NextResponse } from "next/server"
const BACKEND_URL = "https://ai-affiliate-backend.onrender.com/api/v1/ariel/logs"

export async function GET() {
  try {
    const resp = await fetch(BACKEND_URL)
    if (!resp.ok) {
      const errorText = await resp.text()
      console.error(`Backend error: ${resp.status} ${errorText}`)
      throw new Error(`Backend error: ${resp.status}`)
    }
    const data = await resp.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Ariel logs API error:", error)
    return NextResponse.json({ logs: ["No logs available. Please check the backend service and logs for more information."] }, { status: 503 })
  }
}
