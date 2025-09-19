import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { authUtils } from "@/lib/auth-utils"

export async function GET() {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth-token")?.value

    if (!authToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Verify the JWT token
    const verifiedUser = await authUtils.verifyToken(authToken)
    if (!verifiedUser) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    // Get complete user data from database
    const fullUser = await authUtils.getUserById(verifiedUser.id)
    if (!fullUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ user: fullUser })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
