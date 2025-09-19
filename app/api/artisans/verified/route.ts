import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Only fetch verified artisans that have passed all verification checks
    let query = supabase
      .from('verified_artisans') // Use the view we created in migration
      .select(`
        id,
        user_id,
        business_name,
        description,
        bio,
        specialization,
        experience,
        location,
        rating,
        total_reviews,
        certificates,
        whatsapp_number,
        availability_is_available,
        availability_available_for_work,
        availability_available_for_learning,
        availability_response_time,
        pricing_base_rate,
        pricing_learning_rate,
        pricing_currency,
        first_name,
        last_name,
        full_name,
        matric_number,
        department,
        created_at
      `)
      .eq('verified', true)
      .eq('verification_status', 'approved')
      .eq('matric_number_verified', true)
      .eq('business_name_verified', true)
      .eq('certificates_verified', true)
      .eq('bio_verified', true)
      .order('rating', { ascending: false })
      .limit(limit)

    // Add category filter if provided
    if (category && category !== 'all') {
      query = query.contains('specialization', [category])
    }

    // Add search filter if provided
    if (search) {
      query = query.or(`business_name.ilike.%${search}%,description.ilike.%${search}%,bio.ilike.%${search}%`)
    }

    const { data: artisans, error } = await query

    if (error) {
      console.error("Error fetching verified artisans:", error)
      return NextResponse.json(
        { error: "Failed to fetch verified artisans" },
        { status: 500 }
      )
    }

    // Transform data for frontend consumption
    const transformedArtisans = artisans?.map(artisan => ({
      id: artisan.id,
      userId: artisan.user_id,
      businessName: artisan.business_name,
      description: artisan.description,
      bio: artisan.bio,
      specialization: artisan.specialization,
      experience: artisan.experience,
      location: artisan.location,
      rating: artisan.rating,
      totalReviews: artisan.total_reviews,
      certificates: artisan.certificates,
      whatsappNumber: artisan.whatsapp_number,
      availability: {
        isAvailable: artisan.availability_is_available,
        availableForWork: artisan.availability_available_for_work,
        availableForLearning: artisan.availability_available_for_learning,
        responseTime: artisan.availability_response_time
      },
      pricing: {
        baseRate: artisan.pricing_base_rate,
        learningRate: artisan.pricing_learning_rate,
        currency: artisan.pricing_currency
      },
      provider: {
        name: artisan.full_name,
        firstName: artisan.first_name,
        lastName: artisan.last_name,
        matricNumber: artisan.matric_number,
        department: artisan.department
      },
      verified: true, // All returned artisans are verified
      verifiedBadge: true,
      joinedAt: artisan.created_at
    })) || []

    return NextResponse.json({
      success: true,
      data: transformedArtisans,
      total: transformedArtisans.length,
      message: `Found ${transformedArtisans.length} verified artisan(s)`
    })

  } catch (error) {
    console.error("Error in verified artisans API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
