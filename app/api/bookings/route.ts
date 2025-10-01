import { NextRequest, NextResponse } from 'next/server'
import { BookingManager } from '@/lib/marketplace-utils'
import { authenticateRequest } from '@/lib/auth-utils'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') as 'seeker' | 'provider' || 'seeker'

    const result = await BookingManager.getUserBookings(authResult.payload.id, role)

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
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
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
    
    // Get service details to identify provider
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('provider_id, title')
      .eq('id', body.service_id)
      .single()

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Prevent self-booking
    if (service.provider_id === authResult.payload.id) {
      return NextResponse.json(
        { error: 'Cannot book your own service' },
        { status: 400 }
      )
    }

    const bookingData = {
      ...body,
      seeker_id: authResult.payload.id,
      provider_id: service.provider_id,
      service_title: service.title
    }

    const result = await BookingManager.createBooking(bookingData)

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
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
