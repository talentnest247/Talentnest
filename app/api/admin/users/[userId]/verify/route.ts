import { type NextRequest, NextResponse } from "next/server"
import { getUsers, saveUser } from "@/lib/storage"

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const body = await request.json()
    const { action, verificationNotes, accountType } = body

    if (!action || !['verified', 'rejected'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "verified" or "rejected"' },
        { status: 400 }
      )
    }

    const users = getUsers()
    const userIndex = users.findIndex(user => user.id === userId)

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[userIndex]

    // Update user verification status
    const updatedUser = {
      ...user,
      verificationStatus: action as "verified" | "rejected",
      isVerified: action === 'verified',
      isActive: action === 'verified',
      verificationNotes: verificationNotes || '',
      updatedAt: new Date().toISOString()
    }

    // Save updated user
    saveUser(updatedUser)

    // In a real application, you would send email notifications here
    // For now, we'll just log the action
    console.log(`${accountType || 'User'} ${userId} has been ${action}`, {
      userEmail: user.email,
      userName: user.fullName,
      verificationNotes,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: `${accountType || 'User'} ${action} successfully`,
      user: updatedUser
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
