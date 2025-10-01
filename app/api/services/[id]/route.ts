import { NextRequest, NextResponse } from 'next/server'
import { ServiceManager } from '@/lib/marketplace-utils'
import { authenticateRequest } from '@/lib/auth-utils'
import { supabase } from '@/lib/supabase'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        provider:profiles(
          id, full_name, avatar_url, rating_average, total_reviews,
          verification_status, availability_status, location_on_campus,
          skills_offered, specializations
        ),
        category:service_categories(*),
        reviews(
          id, rating, title, content, created_at,
          reviewer:profiles(id, full_name, avatar_url)
        )
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Get service error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Verify ownership
    const { data: service } = await supabase
      .from('services')
      .select('provider_id')
      .eq('id', params.id)
      .single()

    if (!service || service.provider_id !== authResult.payload.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own services' },
        { status: 403 }
      )
    }

    const result = await ServiceManager.updateService(params.id, body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Service updated successfully'
    })

  } catch (error) {
    console.error('Update service error:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.valid || !authResult.payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership
    const { data: service } = await supabase
      .from('services')
      .select('provider_id')
      .eq('id', params.id)
      .single()

    if (!service || service.provider_id !== authResult.payload.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only delete your own services' },
        { status: 403 }
      )
    }

    const result = await ServiceManager.deleteService(params.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    })

  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}