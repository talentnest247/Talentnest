import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const bookingId = params.id
    const body = await request.json()
    const { status, agreedPrice, whatsappChatInitiated } = body

    // Prepare update data
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (status) updateData.status = status
    if (agreedPrice !== undefined) updateData.agreed_price = agreedPrice
    if (whatsappChatInitiated !== undefined) updateData.whatsapp_chat_initiated = whatsappChatInitiated

    // Update booking (RLS will ensure user can only update their own bookings)
    const { data: booking, error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId)
      .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
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
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Booking not found or unauthorized" }, { status: 404 })
      }
      console.error("Error updating booking:", error)
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const bookingId = params.id

    // Update booking status to cancelled instead of deleting
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Booking not found or unauthorized" }, { status: 404 })
      }
      console.error("Error cancelling booking:", error)
      return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
    }

    return NextResponse.json({ message: "Booking cancelled successfully" })
  } catch (error) {
    console.error("Delete booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
