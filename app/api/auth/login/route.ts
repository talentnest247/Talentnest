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
      console.log("Supabase login failed:", authError?.message || "No user data")
      
      // Fallback to mock data for admin and development users
      console.log("Attempting fallback authentication with mock data...")
      const mockUser = await authUtils.getUserByEmail(email)
      
      if (mockUser && 'password' in mockUser && mockUser.password === password) {
        console.log("Mock authentication successful for:", email)
        
        // Generate JWT token for mock user
        const token = await authUtils.generateToken(mockUser)
        
        // Prepare user response
        const userResponse = {
          id: mockUser.id,
          email: mockUser.email,
          fullName: mockUser.fullName,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
          phone: mockUser.phone,
          studentId: mockUser.studentId,
          department: mockUser.department,
          level: mockUser.level
        }

        console.log("Mock login successful for:", email)
        
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
      }
      
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      )
    }

    console.log("User authenticated, fetching profile...")

    // Prefer using the auth user metadata returned by Supabase to avoid
    // hitting Row Level Security policies that can cause recursion errors
    // when querying `profiles` directly. Fall back to querying `profiles`
    // only if necessary.
    let profile: Record<string, unknown> | null = null
    // Try to use user_metadata returned by the auth response (when present)
    const userObj = authData.user as unknown
    const metadata = (userObj && typeof userObj === 'object' && (userObj as Record<string, unknown>)['user_metadata']) ?? null
    if (metadata && typeof metadata === 'object') {
      profile = { ...(metadata as Record<string, unknown>) }
      if (!profile.id) profile.id = authData.user.id
      if (!profile.email) profile.email = authData.user.email
    }

    // If metadata not available, attempt to fetch from profiles table (guarded)
    if (!profile) {
      const { data: fetchedProfile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name, first_name, last_name, role, phone')
        .eq('id', authData.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile from DB:", profileError)
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        )
      }

      profile = fetchedProfile
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
    const p = profile as Record<string, unknown>
    const user = {
      id: String(p.id),
      email: String(p.email),
      fullName: String(p['full_name'] ?? ''),
      firstName: String(p['first_name'] ?? ''),
      lastName: String(p['last_name'] ?? ''),
      userType: (String(p['role']) as unknown) as "student" | "artisan",
      role: (String(p['role']) as unknown) as "student" | "artisan" | "admin",
      phone: String(p['phone'] ?? ''),
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
