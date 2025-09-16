import { type NextRequest, NextResponse } from "next/server"
import { getUsers, updateUserStatus } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const accountType = searchParams.get("accountType")
    const verificationStatus = searchParams.get("verificationStatus")
    const search = searchParams.get("search")

    const users = getUsers()
    let filteredUsers = users

    // Filter by account type (student/artisan)
    if (accountType && accountType !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.accountType === accountType)
    }

    // Filter by verification status (pending/verified/rejected)
    if (verificationStatus && verificationStatus !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.verificationStatus === verificationStatus)
    }

    // Legacy status filter (for backwards compatibility)
    if (status && status !== "all") {
      if (status === "pending") {
        filteredUsers = filteredUsers.filter((user) => user.verificationStatus === "pending")
      } else {
        filteredUsers = filteredUsers.filter((user) => user.status === status)
      }
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchLower) ||
          (user.matricNumber && user.matricNumber.toLowerCase().includes(searchLower)) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.skills && user.skills.some(skill => skill.toLowerCase().includes(searchLower)))
      )
    }

    return NextResponse.json({ users: filteredUsers })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, status, action } = await request.json()

    // In a real app, verify admin authentication here

    const result = updateUserStatus(userId, status)

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User status updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
