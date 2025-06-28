import { NextRequest, NextResponse } from "next/server"

// These should proxy to your backend's Ariel status/log APIs.

export async function GET(req: NextRequest) {
  // GET /api/ariel/status
  const fakeStatus = { running: true, lastActive: new Date().toISOString() }
  return NextResponse.json(fakeStatus)
}

// Handle /api/ariel/logs, /api/ariel/pause, /api/ariel/resume as needed
export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.endsWith("/pause")) {
    // Send pause command to backend Ariel orchestrator
    return NextResponse.json({ status: "paused" })
  } else if (pathname.endsWith("/resume")) {
    // Send resume command to backend Ariel orchestrator
    return NextResponse.json({ status: "resumed" })
  }
  return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
}
