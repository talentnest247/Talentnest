import { NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"

// Mock enrollments storage
let mockEnrollments: any[] = [
  {
    id: "1",
    studentId: "student1",
    skillId: "1",
    providerId: "1",
    status: "active",
    progress: 65,
    enrolledAt: new Date("2024-01-15"),
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const studentId = searchParams.get("studentId")
    const skillId = searchParams.get("skillId")
    const status = searchParams.get("status")

    let filteredEnrollments = mockEnrollments

    if (studentId) {
      filteredEnrollments = filteredEnrollments.filter(e => e.studentId === studentId)
    }

    if (skillId) {
      filteredEnrollments = filteredEnrollments.filter(e => e.skillId === skillId)
    }

    if (status) {
      filteredEnrollments = filteredEnrollments.filter(e => e.status === status)
    }

    return NextResponse.json({ enrollments: filteredEnrollments })
  } catch (error) {
    console.error("Enrollments GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, skillId, providerId } = body

    if (!studentId || !skillId || !providerId) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, skillId, providerId" },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const existingEnrollment = mockEnrollments.find(
      e => e.studentId === studentId && e.skillId === skillId
    )

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this skill" },
        { status: 409 }
      )
    }

    // Create new enrollment
    const newEnrollment = {
      id: `enrollment_${Date.now()}`,
      studentId,
      skillId,
      providerId,
      status: "active",
      progress: 0,
      enrolledAt: new Date(),
    }

    mockEnrollments.push(newEnrollment)

    return NextResponse.json(
      { message: "Successfully enrolled", enrollment: newEnrollment },
      { status: 201 }
    )
  } catch (error) {
    console.error("Enrollments POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
