import { NextRequest, NextResponse } from 'next/server'
import { ReviewManager } from '@/lib/marketplace-utils'
import { authenticateRequest } from '@/lib/auth-utils'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      )
    }

    const result = await ReviewManager.getProviderReviews(providerId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

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
    const { booking_id, reviewee_id, rating, title, content } = body

    // Verify the booking exists and user is authorized to review
    const { data: booking, error: bookingError } = await supabase
      .from('service_bookings')
      .select('seeker_id, provider_id, status')
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only allow reviews if user is part of the booking
    if (booking.seeker_id !== authResult.payload.id && booking.provider_id !== authResult.payload.id) {
      return NextResponse.json(
        { error: 'Unauthorized to review this booking' },
        { status: 403 }
      )
    }

    // Check for duplicate reviews
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', booking_id)
      .eq('reviewer_id', authResult.payload.id)
      .single()

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this booking' },
        { status: 400 }
      )
    }

    const reviewData = {
      booking_id,
      reviewer_id: authResult.payload.id,
      reviewee_id,
      rating,
      title,
      content
    }

    const result = await ReviewManager.createReview(reviewData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
