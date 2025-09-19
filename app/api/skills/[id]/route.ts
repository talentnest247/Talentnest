import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const skill = await mockDatabase.getSkillById(params.id)

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    const artisan = await mockDatabase.getArtisanById(skill.artisanId)

    return NextResponse.json({ skill, artisan })
  } catch (error) {
    console.error("Skill detail API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
