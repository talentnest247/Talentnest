import { type NextRequest, NextResponse } from "next/server"
import { getSkills } from "@/lib/supabase"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const difficulty = searchParams.get("difficulty")
    const maxPrice = searchParams.get("maxPrice")

    // Build filters object
    const filters: any = {}
    
    if (category && category !== "All categories") {
      filters.category = category
    }
    
    if (difficulty && difficulty !== "all") {
      filters.difficulty = difficulty
    }
    
    if (maxPrice) {
      filters.maxPrice = parseInt(maxPrice)
    }

    const skillsData = await getSkills(filters)
    
    // Transform skills to include provider information
    let skills = skillsData.map((skill: any) => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      difficulty: skill.difficulty,
      duration: skill.duration,
      price: skill.price,
      max_students: skill.max_students,
      current_students: skill.current_students,
      images: skill.images || [],
      syllabus: skill.syllabus || [],
      requirements: skill.requirements || [],
      provider: {
        id: skill.provider.id,
        name: skill.provider.user?.full_name || skill.provider.business_name,
        business_name: skill.provider.business_name,
        location: skill.provider.location,
        rating: skill.provider.rating,
        verified: skill.provider.verified,
        whatsapp_number: skill.provider.whatsapp_number,
        profile_image: skill.provider.user?.profile_image
      },
      created_at: skill.created_at,
      updated_at: skill.updated_at
    }))

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      skills = skills.filter((skill: any) =>
        skill.title?.toLowerCase().includes(searchLower) ||
        skill.description?.toLowerCase().includes(searchLower) ||
        skill.category?.toLowerCase().includes(searchLower) ||
        skill.provider?.name?.toLowerCase().includes(searchLower) ||
        skill.provider?.business_name?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({ skills })
  } catch (error) {
    console.error("Skills API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
