import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Admin artisans endpoint' })
}

export async function POST() {
  return NextResponse.json({ message: 'Admin artisans POST endpoint' })
}