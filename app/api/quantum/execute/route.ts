import { NextResponse } from "next/server";
const BACKEND_URL = "http://localhost:3001/quantum/execute"; // Update for your deployment

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const resp = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to execute quantum job", details: error?.toString() }, { status: 500 });
  }
}
