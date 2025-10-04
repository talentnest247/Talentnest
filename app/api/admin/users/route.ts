import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET all users (students and artisans)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userType = searchParams.get('type') // 'student', 'artisan', or 'all'

    // Fetch all users from users table
    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        first_name,
        last_name,
        full_name,
        role,
        phone,
        avatar_url,
        bio,
        created_at,
        updated_at
      `)

    // Filter by role if specified
    if (userType === 'student') {
      query = query.eq('role', 'student')
    } else if (userType === 'artisan') {
      query = query.eq('role', 'provider')
    }

    const { data: users, error: usersError } = await query.order('created_at', { ascending: false })

    if (usersError) {
      console.error("Error fetching users:", usersError)
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      )
    }

    // For artisans, also fetch their business details
    const userIds = users?.map(u => u.id) || []
    const { data: artisans } = await supabase
      .from('providers')
      .select('*')
      .in('user_id', userIds)

    // For students, fetch enrollment data
    const { data: students } = await supabase
      .from('students')
      .select('*')
      .in('user_id', userIds)

    // Merge the data
    const enrichedUsers = users?.map(user => {
      const artisan = artisans?.find(a => a.user_id === user.id)
      const student = students?.find(s => s.user_id === user.id)

      return {
        ...user,
        artisanData: artisan || null,
        studentData: student || null,
        userType: user.role === 'provider' ? 'artisan' : user.role,
        verificationStatus: artisan?.verification_status || null,
        businessName: artisan?.business_name || null,
      }
    })

    return NextResponse.json({
      success: true,
      data: enrichedUsers,
      total: enrichedUsers?.length || 0
    })

  } catch (error) {
    console.error("Error in users API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE user (student or artisan)
export async function DELETE(request: NextRequest) {
  try {
    const { userId, reason } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required field: userId" },
        { status: 400 }
      )
    }

    const adminUserId = "admin-user-id" // TODO: Get from authenticated session

    // Log the deletion action
    await supabase.from('admin_actions').insert({
      admin_id: adminUserId,
      action_type: 'delete_user',
      target_id: userId,
      details: { reason: reason || 'User deleted by admin' },
      created_at: new Date().toISOString()
    })

    // First, check if user exists and get their role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role, email, full_name')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Delete related records first (due to foreign key constraints)
    
    // If artisan, delete artisan-related data
    if (user.role === 'provider') {
      // Delete services offered by this provider
      await supabase.from('services').delete().eq('provider_id', userId)
      
      // Delete provider profile
      await supabase.from('providers').delete().eq('user_id', userId)
      
      // Delete reviews for this artisan
      await supabase.from('reviews').delete().eq('provider_id', userId)
    }

    // If student, delete student-related data
    if (user.role === 'student') {
      // Delete enrollments
      await supabase.from('enrollments').delete().eq('student_id', userId)
      
      // Delete student profile
      await supabase.from('students').delete().eq('user_id', userId)
      
      // Delete bookings made by student
      await supabase.from('bookings').delete().eq('student_id', userId)
      
      // Delete reviews by student
      await supabase.from('reviews').delete().eq('student_id', userId)
    }

    // Delete messages
    await supabase.from('messages').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

    // Finally, delete the user profile
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      console.error("Error deleting user:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `User ${user.full_name} (${user.email}) deleted successfully`,
      deletedUser: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
