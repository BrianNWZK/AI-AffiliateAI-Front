import { NextResponse } from "next/server"
export async function GET() {
  try {
    const resp = await fetch(`${process.env.BACKEND_URL}/api/v1/quantum/logs`)
    if (!resp.ok) {
      const errorText = await resp.text()
      console.error(`Backend error: ${resp.status} ${errorText}`)
      throw new Error(`Backend error: ${resp.status}`)
    }
    const data = await resp.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Quantum logs API error:", error)
    return NextResponse.json({ logs: ["No logs available. Please check the backend service and logs for more information."] }, { status: 503 })
  }
}
