import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function createSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function GET() {
  try {
    const supabase = await createSupabaseClient()

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get artisan verification data
    const { data: artisans, error } = await supabase
      .from('artisan_profiles')
      .select(`
        *,
        user:users(full_name, email, phone),
        documents:artisan_documents(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch artisans' }, { status: 500 })
    }

    return NextResponse.json({ artisans })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { profileId, status, notes } = body

    if (!profileId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    // Update artisan profile
    const { error: profileError } = await supabase
      .from('artisan_profiles')
      .update({
        verification_status: status,
        verification_notes: notes || null,
        verified_at: new Date().toISOString(),
        verified_by: user.id
      })
      .eq('id', profileId)

    if (profileError) {
      console.error('Profile update error:', profileError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Get artisan user ID
    const { data: profileData, error: getProfileError } = await supabase
      .from('artisan_profiles')
      .select('user_id')
      .eq('id', profileId)
      .single()

    if (getProfileError) {
      console.error('Get profile error:', getProfileError)
      return NextResponse.json({ error: 'Failed to get profile data' }, { status: 500 })
    }

    // Update user active status
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        is_active: status === 'approved',
        is_verified: status === 'approved'
      })
      .eq('id', profileData.user_id)

    if (userUpdateError) {
      console.error('User update error:', userUpdateError)
      return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Artisan ${status} successfully`,
      status 
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
