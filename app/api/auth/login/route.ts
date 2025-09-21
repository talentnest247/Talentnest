import { NextRequest, NextResponse } from "next/server";

import { authUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      console.log("Login failed: Missing email or password")
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Attempting login for:", email)

    // Find user in Supabase
    const user = await authUtils.getUserByEmail(email)
    if (!user) {
      console.log("Login failed: User not found for email:", email)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    console.log("User found, verifying password...")

    // Verify password
    const valid = await authUtils.verifyPassword(password, user.password)
    if (!valid) {
      console.log("Login failed: Invalid password for user:", email)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    console.log("Password verified successfully for:", email)

    // Generate JWT token
    const token = await authUtils.generateToken(user)

    // Prepare user response (omit password)
    const userResponse = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      studentId: user.studentId,
      department: user.department,
      level: user.level
    }

    // Set auth cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: userResponse,
      token
    })
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    return response
  } catch (error: any) {
      console.error("Login error:", error);
      return NextResponse.json(
        { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  }
