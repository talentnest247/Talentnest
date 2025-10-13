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

    // Get provider profile
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (providerError || !provider) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 })
    }

    // Get analytics (mock data for now - implement actual analytics later)
    const analytics = {
      total_views: 127,
      total_contacts: 45,
      total_bookings: 12,
      completed_jobs: 8,
      total_earnings: 15000,
      response_rate: 95
    }

    return NextResponse.json({
      profile: provider,
      analytics
    })
  } catch (error) {
    console.error('Error fetching provider profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
