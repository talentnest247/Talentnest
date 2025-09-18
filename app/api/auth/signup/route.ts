import { type NextRequest, NextResponse } from "next/server"
import { saveUser, getUserByEmail, getUserByMatricNumber, generateId, getCurrentTimestamp } from "@/lib/storage"
import { validateMatricNumber, validateEmail, validatePhoneNumber, formatPhoneNumber } from "@/lib/validation"
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
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // Check if user already exists
    if (getUserByMatricNumber(matricNumber)) {
      return NextResponse.json({ error: "Matric number already registered" }, { status: 409 })
    }

    if (getUserByEmail(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
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
      certificates: [],
      accountType: "student",
      verificationStatus: "pending",
      isVerified: false,
      isActive: true,
      status: "pending",
      rating: 0,
      totalReviews: 0,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    // Save user
    saveUser(newUser)

    // Return user data (excluding sensitive info)
    const { ...userData } = newUser
    return NextResponse.json({ user: userData }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
