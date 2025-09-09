import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const providerId = searchParams.get("providerId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("services")
      .select(`
        *,
        provider:users!services_provider_id_fkey(
          id,
          full_name,
          faculty,
          total_rating,
          total_reviews,
          is_verified
        ),
        category:service_categories!services_category_id_fkey(
          id,
          name,
          icon
        )
      `)
      .eq("status", "active")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category_id", category)
    }

    if (providerId) {
      query = query.eq("provider_id", providerId)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: services, error } = await query

    if (error) {
      console.error("Error fetching services:", error)
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Services API error:", error)
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
    const { title, description, categoryId, price, priceType, deliveryTime, requirements, portfolioItems } = body

    // Validate required fields
    if (!title || !description || !categoryId || !price || !priceType || !deliveryTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create service
    const { data: service, error } = await supabase
      .from("services")
      .insert({
        provider_id: user.id,
        title,
        description,
        category_id: categoryId,
        price: Number.parseFloat(price),
        price_type: priceType,
        delivery_time: deliveryTime,
        requirements: requirements || "",
        portfolio_items: portfolioItems || [],
        status: "active",
      })
      .select(`
        *,
        provider:users!services_provider_id_fkey(
          id,
          full_name,
          faculty,
          total_rating,
          total_reviews,
          is_verified
        ),
        category:service_categories!services_category_id_fkey(
          id,
          name,
          icon
        )
      `)
      .single()

    if (error) {
      console.error("Error creating service:", error)
      return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
    }

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error("Create service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
