import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { validateMatricNumber, validateUnilorinEmail, validatePhoneNumber, formatPhoneNumber } from "@/lib/validation"
import type { User } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      matricNumber,
      email,
      fullName,
      phoneNumber,
      whatsappNumber,
      faculty,
      department,
      level,
      password,
      skills,
      bio,
    } = body

    // Validate required fields
    if (!matricNumber || !email || !fullName || !phoneNumber || !faculty || !department || !level || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate matric number format
    if (!validateMatricNumber(matricNumber)) {
      return NextResponse.json({ error: "Invalid matric number format" }, { status: 400 })
    }

    // Validate email format
    if (!validateUnilorinEmail(email)) {
      return NextResponse.json({ error: "Invalid UNILORIN email format" }, { status: 400 })
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user already exists
    const { data: existingMatricUser } = await supabase
      .from('users')
      .select('id')
      .eq('matricNumber', matricNumber)
      .single()

    if (existingMatricUser) {
      return NextResponse.json({ error: "Matric number already registered" }, { status: 409 })
    }

    const { data: existingEmailUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmailUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          matricNumber,
          fullName,
          phoneNumber: formatPhoneNumber(phoneNumber),
          faculty,
          department,
          level
        }
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user account" }, { status: 400 })
    }

    // Create user profile in database
    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      matricNumber,
      email,
      fullName,
      phoneNumber: formatPhoneNumber(phoneNumber),
      whatsappNumber: whatsappNumber ? formatPhoneNumber(whatsappNumber) : formatPhoneNumber(phoneNumber),
      faculty,
      department,
      level,
      bio: bio || "",
      skills: skills
        ? skills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      portfolioLinks: [],
      isVerified: false,
      isActive: true,
      rating: 0,
      totalReviews: 0,
    }

    // Insert user profile with the auth user ID
    const { data: userData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        ...newUser
      })
      .select()
      .single()

    if (insertError) {
      // If profile creation fails, clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 400 })
    }

    // Return user data (excluding sensitive info)
    return NextResponse.json({ 
      user: userData,
      session: authData.session,
      message: "Account created successfully! Please check your email to verify your account."
    }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
