import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET() {
  try {
    const headersList = headers()
    const headersObject = Object.fromEntries(headersList.entries())
    return NextResponse.json(headersObject)
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: "Failed to fetch headers" }, { status: 500 })
  }
}
