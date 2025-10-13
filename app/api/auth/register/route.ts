import { NextRequest, NextResponse } from "next/server";
import { authUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Validate required fields
    const { email, password, firstName, lastName, phone, role } = userData;

    if (!email || !password || !firstName || !lastName || !phone || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, firstName, lastName, phone, role" },
        { status: 400 }
      );
    }

    // Accept both 'provider' and 'artisan' - normalize to 'artisan' for database
    const normalizedRole = role === "provider" ? "artisan" : role;
    
    if (!["student", "artisan"].includes(normalizedRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'student', 'artisan', or 'provider'" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = String(email).trim().toLowerCase()

    // Check if user already exists
    const existingUser = await authUtils.getUserByEmail(normalizedEmail)
    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    console.log("Creating user:", { email, role: normalizedRole, firstName, lastName })
    
    // Create user using Supabase Auth
    const fullName = `${firstName} ${lastName}`
    let newUser
    try {
      newUser = await authUtils.createUser({
      email: normalizedEmail,
      password,
      firstName,
      lastName,
      fullName,
      phone,
      role: normalizedRole,
      studentId: normalizedRole === "student" ? userData.studentId || null : null,
      department: normalizedRole === "student" ? userData.department || null : null,
      level: normalizedRole === "student" ? userData.level || null : null,
    })
    } catch (err: unknown) {
      const e = err as Error & { code?: string }
      console.error(`createUser error code=${e?.code ?? 'unknown'} message=${e?.message ?? ''}`)
      // Supabase auth returns code 'email_exists' for duplicate emails
      if (e?.code === 'email_exists' || e?.code === '23505' || /email_exists/i.test(e?.message || '')) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create user', details: e?.message || String(err) }, { status: 500 })
    }

    if (!newUser) {
      console.error("Failed to create user - authUtils.createUser returned null")
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    console.log("User created successfully:", newUser.id)

    // If artisan/provider, create provider profile in providers table
    if (normalizedRole === "artisan") {
      try {
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Combine all uploaded documents
        const allDocuments = [
          ...(userData.certificates || []),
          ...(userData.workSamples || []),
          ...(userData.portfolio || [])
        ]

        const providerData = {
          user_id: newUser.id,
          business_name: userData.businessName || `${fullName}'s Services`,
          description: userData.bio || "Professional service provider",
          bio: userData.bio || null,
          specialization: userData.specialization ? [userData.specialization] : [],
          experience: userData.experience || 0,
          location: userData.location || "",
          verification_status: "pending",
          verification_evidence: allDocuments,
          certificates: userData.certificates || [],
          rating: 0,
          total_reviews: 0,
          verified: false,
          availability_is_available: true,
          availability_available_for_work: true,
          availability_available_for_learning: false,
          availability_response_time: "Usually responds within 24 hours",
          pricing_currency: "NGN",
          pricing_base_rate: null,
          pricing_learning_rate: null,
          whatsapp_number: userData.phone || null,
        }

        const { data, error } = await supabase
          .from("providers")
          .insert([providerData])
          .select()

        if (error) {
          console.error("Failed to create provider profile:", error)
        } else {
          console.log("Provider profile created successfully:", data)
        }
      } catch (error) {
        console.error("Error creating provider profile:", error)
        // Don't fail the registration if provider profile creation fails
      }
    }

    // Generate JWT token
    const token = await authUtils.generateToken(newUser)

    // Create response
    const response = NextResponse.json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        phone: newUser.phone,
        studentId: newUser.studentId,
        department: newUser.department,
        level: newUser.level
      },
      token
    }, { status: 201 })
    
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}