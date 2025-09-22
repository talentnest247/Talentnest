import { NextRequest, NextResponse } from "next/server"

type Enrollment = {
  id: string
  studentId: string
  skillId: string
  providerId: string
  providerName: string
  status: string
  progress?: number
  enrolledAt: string
}

// Mock enrollments storage
const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    studentId: "student1",
    skillId: "1",
    providerId: "1",
    providerName: "Sarah Design Studios",
    status: "active",
    progress: 65,
    enrolledAt: "2024-01-15T00:00:00.000Z",
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
    const { studentId, skillId, providerId, providerName } = body

    if (!studentId || !skillId || !providerId || !providerName) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, skillId, providerId, providerName" },
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
    const newEnrollment: Enrollment = {
      id: `enrollment_${Date.now()}`,
      studentId,
      skillId,
      providerId,
      providerName,
      status: "active",
      progress: 0,
      enrolledAt: new Date().toISOString(),
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
