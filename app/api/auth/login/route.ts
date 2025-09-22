import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"
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

    if (!supabaseAdmin) {
      console.error("Supabase admin client not available")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Use Supabase Auth to sign in
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      console.log("Login failed:", authError?.message || "No user data")
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    console.log("User authenticated, fetching profile...")

    // Get user profile data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, first_name, last_name, role, phone')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError)
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Get additional data based on role
    let additionalData: { studentId?: string; department?: string; level?: number } = {}
    if (profile.role === 'student') {
      const { data: student } = await supabaseAdmin
        .from('students')
        .select('student_id, department, level')
        .eq('user_id', profile.id)
        .single()
      
      if (student) {
        additionalData = {
          studentId: student.student_id,
          department: student.department,
          level: student.level
        }
      }
    }

    // Create user object for token generation
    const user = {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      firstName: profile.first_name,
      lastName: profile.last_name,
      userType: profile.role as "student" | "artisan",
      role: profile.role as "student" | "artisan" | "admin",
      phone: profile.phone,
      ...additionalData
    }

    console.log("Generating token for user:", user.email)

    // Generate JWT token
    const token = await authUtils.generateToken(user)

    // Prepare user response
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

    console.log("Login successful for:", email)
    
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
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
