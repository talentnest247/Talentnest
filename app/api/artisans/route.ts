import { type NextRequest, NextResponse } from "next/server"
import { getProviders } from "@/lib/supabase"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get("search")
    const location = searchParams.get("location")

    // IMPORTANT: Only show verified artisans to students
    // Get providers from Supabase with strict verification filters
    const filters: Record<string, boolean | string> = {
      verified: true, // Must be verified
      verification_status: 'approved' // Must be approved by admin
    }
    
    if (location && location !== "All locations") {
      filters.location = location
    }

    const providers = await getProviders(filters)

    // Filter out any providers that don't meet all verification requirements
    const fullyVerifiedProviders = providers.filter((provider: unknown) => {
      const p = provider as Record<string, unknown>
      return (
        p.verified === true &&
        p.verification_status === 'approved' &&
        p.bio && // Must have bio
        p.certificates && Array.isArray(p.certificates) && p.certificates.length > 0 && // Must have certificates
        p.business_name && // Must have business name
        p.user && typeof p.user === 'object' && p.user !== null &&
        (p.user as Record<string, unknown>).student_id // Must have matric number
      )
    })

    // Transform providers to match expected artisan format
    let artisans = fullyVerifiedProviders.map((provider: unknown) => {
      const p = provider as Record<string, unknown>
      const user = p.user as Record<string, unknown> | null
      return {
        id: p.id,
        name: user?.full_name || p.business_name,
        business_name: p.business_name,
        description: p.description,
        location: p.location,
        skills: p.specialization,
        experience: p.experience,
        rating: p.rating,
        total_reviews: p.total_reviews,
        is_verified: p.verified,
        verification_status: p.verification_status,
        whatsapp_number: p.whatsapp_number,
        email: user?.email,
        phone: user?.phone,
        profile_image: user?.profile_image,
        availability: {
          isAvailable: p.availability_is_available,
          availableForWork: p.availability_available_for_work,
          availableForLearning: p.availability_available_for_learning,
          responseTime: p.availability_response_time
        },
        pricing: {
          serviceRate: p.pricing_base_rate,
          learningRate: p.pricing_learning_rate,
          currency: p.pricing_currency
        }
      }
    })

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      artisans = artisans.filter((artisan: Record<string, unknown>) =>
        String(artisan.name || '').toLowerCase().includes(searchLower) ||
        String(artisan.business_name || '').toLowerCase().includes(searchLower) ||
        String(artisan.description || '').toLowerCase().includes(searchLower) ||
        (Array.isArray(artisan.skills) && artisan.skills.some((skill: unknown) => 
          String(skill).toLowerCase().includes(searchLower)
        ))
      )
    }

    return NextResponse.json({ artisans })
  } catch (error) {
    console.error("Artisans API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
