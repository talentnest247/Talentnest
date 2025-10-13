import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Get user from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get provider ID
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    // Fetch bookings from bookings table
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        student:student_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('provider_id', provider.id)
      .order('created_at', { ascending: false })

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
    }

    // Format bookings data
    const formattedBookings = (bookings || []).map(booking => ({
      id: booking.id,
      student_name: booking.student?.full_name || booking.student?.email || 'Unknown',
      student_email: booking.student?.email || '',
      student_avatar: booking.student?.avatar_url,
      service: booking.service_name,
      status: booking.status,
      amount: booking.amount || 0,
      created_at: booking.created_at,
      due_date: booking.due_date
    }))

    return NextResponse.json({ bookings: formattedBookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
