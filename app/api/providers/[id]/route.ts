import { NextRequest, NextResponse } from "next/server"
import { getProviderById } from "@/lib/database"

// GET /api/providers/[id] - Get provider by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Provider ID is required" },
        { status: 400 }
      )
    }

    const provider = await getProviderById(id)
    
    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: provider
    })
  } catch (error) {
    console.error("[v0] Error fetching provider:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch provider" },
      { status: 500 }
    )
  }
}
