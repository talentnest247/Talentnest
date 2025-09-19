import { type NextRequest, NextResponse } from "next/server"
import { getProviders } from "@/lib/supabase"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get("search")
    const location = searchParams.get("location")
    const verified = searchParams.get("verified")

    // IMPORTANT: Only show verified artisans to students
    // Get providers from Supabase with strict verification filters
    const filters: any = {
      verified: true, // Must be verified
      verification_status: 'approved' // Must be approved by admin
    }
    
    if (location && location !== "All locations") {
      filters.location = location
    }

    const providers = await getProviders(filters)

    // Filter out any providers that don't meet all verification requirements
    const fullyVerifiedProviders = providers.filter((provider: any) => 
      provider.verified === true &&
      provider.verification_status === 'approved' &&
      provider.bio && // Must have bio
      provider.certificates && provider.certificates.length > 0 && // Must have certificates
      provider.business_name && // Must have business name
      provider.user?.student_id // Must have matric number
    )

    // Transform providers to match expected artisan format
    let artisans = fullyVerifiedProviders.map((provider: any) => ({
      id: provider.id,
      name: provider.user?.full_name || provider.business_name,
      business_name: provider.business_name,
      description: provider.description,
      location: provider.location,
      skills: provider.specialization,
      experience: provider.experience,
      rating: provider.rating,
      total_reviews: provider.total_reviews,
      is_verified: provider.verified,
      verification_status: provider.verification_status,
      whatsapp_number: provider.whatsapp_number,
      email: provider.user?.email,
      phone: provider.user?.phone,
      profile_image: provider.user?.profile_image,
      availability: {
        isAvailable: provider.availability_is_available,
        availableForWork: provider.availability_available_for_work,
        availableForLearning: provider.availability_available_for_learning,
        responseTime: provider.availability_response_time
      },
      pricing: {
        baseRate: provider.pricing_base_rate,
        learningRate: provider.pricing_learning_rate,
        currency: provider.pricing_currency
      }
    }))

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      artisans = artisans.filter((artisan: any) =>
        artisan.name?.toLowerCase().includes(searchLower) ||
        artisan.business_name?.toLowerCase().includes(searchLower) ||
        artisan.description?.toLowerCase().includes(searchLower) ||
        (artisan.skills && artisan.skills.some((skill: string) => 
          skill.toLowerCase().includes(searchLower)
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
