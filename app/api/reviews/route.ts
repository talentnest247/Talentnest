import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const serviceId = searchParams.get("serviceId")
    const revieweeId = searchParams.get("revieweeId")

    let query = supabase
      .from("reviews")
      .select(`
        *,
        reviewer:users!reviews_reviewer_id_fkey(
          id,
          full_name,
          faculty,
          is_verified
        ),
        service:services!reviews_service_id_fkey(
          id,
          title
        )
      `)
      .order("created_at", { ascending: false })

    if (serviceId) {
      query = query.eq("service_id", serviceId)
    }

    if (revieweeId) {
      query = query.eq("reviewee_id", revieweeId)
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Reviews API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, serviceId, revieweeId, rating, comment } = body

    // Validate required fields
    if (!bookingId || !serviceId || !revieweeId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify booking exists and user is part of it
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, client_id, provider_id, status")
      .eq("id", bookingId)
      .eq("status", "completed")
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found or not completed" }, { status: 404 })
    }

    if (booking.client_id !== user.id && booking.provider_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to review this booking" }, { status: 403 })
    }

    // Create review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        booking_id: bookingId,
        service_id: serviceId,
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        rating: Number.parseInt(rating),
        comment: comment || "",
      })
      .select(`
        *,
        reviewer:users!reviews_reviewer_id_fkey(
          id,
          full_name,
          faculty,
          is_verified
        ),
        service:services!reviews_service_id_fkey(
          id,
          title
        )
      `)
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
