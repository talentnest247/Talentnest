import { NextRequest, NextResponse } from "next/server"
import { getAllProviders } from "@/lib/database-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const verified = searchParams.get("verified")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Parse and validate parameters
    const searchTerm = search || ""
    const categoryFilter = category && category !== "all" ? category : ""
    const locationFilter = location && location !== "all" ? location : ""
    const verifiedFilter = verified === "true"
    const limitNum = limit ? parseInt(limit) : 20
    const offsetNum = offset ? parseInt(offset) : 0

    const providers = await getAllProviders()

    // Apply filters client-side for now
    let filteredProviders = providers

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredProviders = filteredProviders.filter(provider =>
        provider.businessName?.toLowerCase().includes(searchLower) ||
        provider.description?.toLowerCase().includes(searchLower) ||
        provider.specialization?.some(spec => spec.toLowerCase().includes(searchLower))
      )
    }

    if (categoryFilter) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.specialization?.some(spec => spec.toLowerCase().includes(categoryFilter.toLowerCase()))
      )
    }

    if (locationFilter) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.location?.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    if (verifiedFilter) {
      filteredProviders = filteredProviders.filter(provider => provider.verified)
    }

    // Apply pagination
    const startIndex = offsetNum
    const endIndex = startIndex + limitNum
    const paginatedProviders = filteredProviders.slice(startIndex, endIndex)

    return NextResponse.json({
      providers: paginatedProviders,
      total: filteredProviders.length,
      limit: limitNum,
      offset: offsetNum
    })
  } catch (error) {
    console.error("Providers API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      businessName,
      description,
      location,
      specialization,
      experience,
      whatsappNumber,
      availability
    } = body

    // Validate required fields
    if (!userId || !businessName || !description || !location || !specialization) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Validate user exists
    // 2. Check if user is already a provider
    // 3. Save to database
    // 4. Send verification email

    console.log("Provider registration:", {
      userId,
      businessName,
      description,
      location,
      specialization,
      experience,
      whatsappNumber,
      availability,
      timestamp: new Date().toISOString()
    })

    // Mock response
    const newProvider = {
      id: `provider_${Date.now()}`,
      userId,
      businessName,
      description,
      location,
      specialization,
      experience: experience || "1-2 years",
      whatsappNumber,
      availability: availability || {
        isAvailable: true,
        availableForWork: true,
        availableForLearning: true,
        responseTime: "Within 24 hours"
      },
      verified: false,
      verificationStatus: "pending",
      rating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(
      {
        message: "Provider registration submitted successfully",
        provider: newProvider
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Provider creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
