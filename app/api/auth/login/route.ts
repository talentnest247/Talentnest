import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/storage"
import { validateUnilorinEmail } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Validate email format
    if (!validateUnilorinEmail(email)) {
      return NextResponse.json({ error: "Invalid UNILORIN email format" }, { status: 400 })
    }

    // Check if user exists
    const user = getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, you'd verify the password hash here
    // For now, we'll just check if password is provided
    if (!password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Return user data (excluding sensitive info)
    const { ...userData } = user
    return NextResponse.json({ user: userData }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
