"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EnrollmentForm } from "@/components/skills/enrollment-form"
import { mockDatabase } from "@/lib/mock-data"
import type { Skill, Artisan } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EnrollPage() {
  const params = useParams()
  const router = useRouter()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!params.id) return

      try {
        const skillData = await mockDatabase.getSkillById(params.id as string)
        if (skillData) {
          setSkill(skillData)
          const artisanData = await mockDatabase.getArtisanById(skillData.artisanId)
          setArtisan(artisanData)
        }
      } catch (error) {
        console.error("Failed to load enrollment data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const handleEnrollmentSuccess = () => {
    router.push("/dashboard?tab=learning")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!skill || !artisan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Skill Not Found</h1>
            <p className="text-muted-foreground mb-4">The skill you're trying to enroll in doesn't exist.</p>
            <Button asChild>
              <Link href="/skills">Back to Skills</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Enroll in Skill</h1>
            <p className="text-muted-foreground">Complete your enrollment to start learning {skill.title}</p>
          </div>

          <EnrollmentForm skill={skill} artisan={artisan} onEnrollmentSuccess={handleEnrollmentSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
