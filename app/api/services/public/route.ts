import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build query - ONLY fetch services from APPROVED providers
    let query = supabase
      .from('services')
      .select(`
        *,
        provider:providers!inner (
          id,
          user_id,
          business_name,
          verification_status,
          verified,
          rating,
          total_reviews,
          location,
          whatsapp_number,
          availability_is_available,
          availability_available_for_work,
          availability_response_time,
          user:users (
            id,
            full_name,
            email,
            phone,
            avatar_url
          )
        ),
        category:categories (
          id,
          name,
          icon
        )
      `)
      // CRITICAL: Only show services from APPROVED providers
      .eq('provider.verification_status', 'approved')
      .eq('provider.verified', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    const { data: services, error } = await query

    if (error) {
      console.error('Error fetching services:', error)
      return NextResponse.json(
        { error: 'Failed to fetch services', details: error.message },
        { status: 500 }
      )
    }

    // Filter out services where provider is not approved (double-check)
    const approvedServices = (services || []).filter(
      service => service.provider?.verification_status === 'approved' && service.provider?.verified === true
    )

    return NextResponse.json({
      success: true,
      data: approvedServices,
      count: approvedServices.length,
      message: approvedServices.length === 0 
        ? 'No services found from approved providers' 
        : `Found ${approvedServices.length} services from approved providers`
    })

  } catch (error) {
    console.error('Get public services error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
