import { NextResponse } from "next/server";
const BACKEND_URL = "http://localhost:3002/ariel/activities";

export async function GET() {
  try {
    const resp = await fetch(BACKEND_URL);
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Ariel activities", details: error?.toString() }, { status: 500 });
  }
}
