import { type NextRequest, NextResponse } from "next/server"
import { getUsers, updateUserStatus } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const users = getUsers()
    let filteredUsers = users

    if (status && status !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchLower) ||
          user.matricNumber.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json({ users: filteredUsers })
  } catch (error) {
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
