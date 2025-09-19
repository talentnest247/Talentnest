import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ verificationRequests: [] })
}

export async function POST() {
  return NextResponse.json(
    { error: "Admin verification system is currently disabled" }, 
    { status: 503 }
  )
}
