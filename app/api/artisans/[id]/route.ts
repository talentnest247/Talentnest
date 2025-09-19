import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const artisan = await mockDatabase.getArtisanById(params.id)

    if (!artisan) {
      return NextResponse.json({ error: "Artisan not found" }, { status: 404 })
    }

    // Get artisan's skills
    const allSkills = await mockDatabase.getSkills()
    const artisanSkills = allSkills.filter((skill) => skill.artisanId === params.id)

    return NextResponse.json({ artisan, skills: artisanSkills })
  } catch (error) {
    console.error("Artisan detail API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
