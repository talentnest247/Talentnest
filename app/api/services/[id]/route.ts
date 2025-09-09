import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: service, error } = await supabase
      .from("services")
      .select(`
        *,
        provider:users!services_provider_id_fkey(
          id,
          full_name,
          faculty,
          department,
          level,
          bio,
          skills,
          total_rating,
          total_reviews,
          is_verified,
          phone_number,
          whatsapp_number
        ),
        category:service_categories!services_category_id_fkey(
          id,
          name,
          icon
        ),
        reviews:reviews!reviews_service_id_fkey(
          id,
          rating,
          comment,
          created_at,
          reviewer:users!reviews_reviewer_id_fkey(
            id,
            full_name,
            faculty,
            is_verified
          )
        )
      `)
      .eq("id", id)
      .eq("status", "active")
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Service not found" }, { status: 404 })
      }
      console.error("Error fetching service:", error)
      return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error("Service API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const { id } = params
    const body = await request.json()

    // Update service (RLS will ensure user can only update their own services)
    const { data: service, error } = await supabase
      .from("services")
      .update(body)
      .eq("id", id)
      .eq("provider_id", user.id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Service not found or unauthorized" }, { status: 404 })
      }
      console.error("Error updating service:", error)
      return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error("Update service error:", error)
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

    const { id } = params

    // Delete service (RLS will ensure user can only delete their own services)
    const { error } = await supabase.from("services").delete().eq("id", id).eq("provider_id", user.id)

    if (error) {
      console.error("Error deleting service:", error)
      return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
    }

    return NextResponse.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Delete service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
