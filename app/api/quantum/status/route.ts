import { NextResponse } from "next/server";
const BACKEND_URL = "http://localhost:3001/quantum/status"; // Update for your deployment

export async function GET() {
  try {
    const resp = await fetch(BACKEND_URL);
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: "offline", lastActive: null }, { status: 503 });
  }
}
