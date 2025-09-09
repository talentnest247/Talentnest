import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "client" or "provider"

    let query = supabase
      .from("bookings")
      .select(`
        *,
        service:services!bookings_service_id_fkey(
          id,
          title,
          price,
          price_type
        ),
        client:users!bookings_client_id_fkey(
          id,
          full_name,
          faculty,
          phone_number,
          whatsapp_number,
          is_verified
        ),
        provider:users!bookings_provider_id_fkey(
          id,
          full_name,
          faculty,
          phone_number,
          whatsapp_number,
          is_verified
        )
      `)
      .order("created_at", { ascending: false })

    if (type === "client") {
      query = query.eq("client_id", user.id)
    } else if (type === "provider") {
      query = query.eq("provider_id", user.id)
    } else {
      // Get all bookings for the user (both as client and provider)
      query = query.or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Get bookings error:", error)
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
    const { serviceId, providerId, title, description, agreedPrice } = body

    // Validate required fields
    if (!serviceId || !providerId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify service exists and get provider info
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id, provider_id, title, price")
      .eq("id", serviceId)
      .eq("status", "active")
      .single()

    if (serviceError || !service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    if (service.provider_id !== providerId) {
      return NextResponse.json({ error: "Invalid provider for this service" }, { status: 400 })
    }

    // Create new booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        service_id: serviceId,
        client_id: user.id,
        provider_id: providerId,
        title,
        description: description || "",
        agreed_price: agreedPrice || service.price,
        status: "pending",
        whatsapp_chat_initiated: false,
      })
      .select(`
        *,
        service:services!bookings_service_id_fkey(
          id,
          title,
          price,
          price_type
        ),
        client:users!bookings_client_id_fkey(
          id,
          full_name,
          faculty,
          phone_number,
          whatsapp_number,
          is_verified
        ),
        provider:users!bookings_provider_id_fkey(
          id,
          full_name,
          faculty,
          phone_number,
          whatsapp_number,
          is_verified
        )
      `)
      .single()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
