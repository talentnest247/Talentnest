import { NextRequest, NextResponse } from 'next/server'
import { SearchManager } from '@/lib/marketplace-utils'
import { authenticateRequest } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      query: searchParams.get('query') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
      price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
      rating_min: searchParams.get('rating_min') ? Number(searchParams.get('rating_min')) : undefined,
      verification_status: (searchParams.get('verification_status') as 'verified' | 'all') || 'all',
      availability: (searchParams.get('availability') as 'online' | 'all') || 'all',
      location: searchParams.get('location') || undefined,
      delivery_time_max: searchParams.get('delivery_time_max') ? Number(searchParams.get('delivery_time_max')) : undefined,
      sort_by: (searchParams.get('sort_by') as 'newest' | 'price_low' | 'price_high' | 'rating' | 'popular') || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12
    }

    const result = await SearchManager.searchServices(filters)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.data?.page || 1,
        limit: result.data?.limit || 12,
        total: result.data?.total_count || 0,
        total_pages: result.data?.total_pages || 1
      }
    })

  } catch (error) {
    console.error('Search services error:', error)
    return NextResponse.json(
      { error: 'Failed to search services' },
      { status: 500 }
    )
  }
}

// For authenticated searches (to track analytics)
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { filters, track_analytics = true } = body

    const result = await SearchManager.searchServices(filters)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Track search analytics if enabled
    if (track_analytics && filters.query) {
      // This would be implemented to store search analytics
      // await SearchAnalyticsManager.trackSearch(authResult.payload.userId, filters)
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.data?.page || 1,
        limit: result.data?.limit || 12,
        total: result.data?.total_count || 0,
        total_pages: result.data?.total_pages || 1
      }
    })

  } catch (error) {
    console.error('Authenticated search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
}