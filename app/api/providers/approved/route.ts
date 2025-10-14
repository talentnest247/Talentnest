import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get('specialization')
    const location = searchParams.get('location')
    const search = searchParams.get('search')

    // Build query - ONLY fetch APPROVED and VERIFIED providers
    let query = supabase
      .from('providers')
      .select(`
        *,
        user:users (
          id,
          email,
          full_name,
          first_name,
          last_name,
          phone,
          avatar_url,
          bio
        ),
        services:services (
          id,
          title,
          description,
          price_type,
          base_price,
          max_price,
          images
        )
      `)
      // CRITICAL: Only show APPROVED and VERIFIED providers
      .eq('verification_status', 'approved')
      .eq('verified', true)
      .order('rating', { ascending: false })

    if (specialization && specialization !== 'all') {
      query = query.contains('specialization', [specialization])
    }

    if (location && location !== 'all') {
      query = query.ilike('location', `%${location}%`)
    }

    if (search) {
      query = query.or(`business_name.ilike.%${search}%,description.ilike.%${search}%,specialization.cs.{${search}}`)
    }

    const { data: providers, error } = await query

    if (error) {
      console.error('Error fetching approved providers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch providers', details: error.message },
        { status: 500 }
      )
    }

    // Double-check: Filter to ensure ONLY approved providers
    const approvedProviders = (providers || []).filter(
      provider => provider.verification_status === 'approved' && provider.verified === true
    )

    console.log(`✅ Found ${approvedProviders.length} APPROVED providers (Total in DB: ${providers?.length || 0})`)

    return NextResponse.json({
      success: true,
      data: approvedProviders,
      count: approvedProviders.length,
      message: approvedProviders.length === 0 
        ? 'No approved providers found. Providers need admin approval first.' 
        : `Found ${approvedProviders.length} approved providers`
    })

  } catch (error) {
    console.error('Get approved providers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}
