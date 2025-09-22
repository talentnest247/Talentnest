import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const artisan = await mockDatabase.getProviderById(params.id)

    if (!artisan) {
      return NextResponse.json({ error: "Artisan not found" }, { status: 404 })
    }

    // Return artisan with their portfolio
    return NextResponse.json({
      artisan,
      portfolio: artisan.portfolio
    })
  } catch (error) {
    console.error("Artisan detail API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
