"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, BookOpen, Star, CheckCircle, MapPin } from "lucide-react"
import { mockDatabase } from "@/lib/mock-data"
import type { Skill, Artisan } from "@/lib/types"
import Link from "next/link"

export default function SkillDetailPage() {
  const params = useParams()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSkillData = async () => {
      if (!params.id) return

      try {
        const skillData = await mockDatabase.getSkillById(params.id as string)
        if (skillData) {
          setSkill(skillData)
          const artisanData = await mockDatabase.getArtisanById(skillData.artisanId)
          setArtisan(artisanData)
        }
      } catch (error) {
        console.error("Failed to load skill data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSkillData()
  }, [params.id])

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
            <p className="text-muted-foreground mb-4">The skill you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/skills">Back to Skills</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const spotsLeft = skill.maxStudents - skill.currentStudents
  const isFullyBooked = spotsLeft <= 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{skill.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline">{skill.category}</Badge>
                      <Badge
                        variant={
                          skill.difficulty === "beginner"
                            ? "secondary"
                            : skill.difficulty === "intermediate"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {skill.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{skill.description}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{skill.duration}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">
                        {skill.currentStudents}/{skill.maxStudents}
                      </p>
                      <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{skill.syllabus.length}</p>
                      <p className="text-xs text-muted-foreground">Modules</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={isFullyBooked ? "destructive" : spotsLeft <= 3 ? "secondary" : "outline"}>
                      {isFullyBooked ? "Full" : `${spotsLeft} spots left`}
                    </Badge>
                  </div>
                </div>

                {/* Artisan Info */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3">Your Instructor</h3>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={artisan.profileImage || "/placeholder.svg"}
                        alt={`${artisan.firstName} ${artisan.lastName}`}
                      />
                      <AvatarFallback className="bg-unilorin-purple text-white">
                        {artisan.firstName[0]}
                        {artisan.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {artisan.firstName} {artisan.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{artisan.businessName}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {artisan.rating} ({artisan.totalReviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{artisan.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollment Card */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <div className="text-center">
                  <p className="text-3xl font-bold text-unilorin-purple">₦{skill.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" disabled={isFullyBooked} asChild={!isFullyBooked}>
                  {isFullyBooked ? "Fully Booked" : <Link href={`/skills/${skill.id}/enroll`}>Enroll Now</Link>}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {isFullyBooked ? "This skill is fully booked" : `${spotsLeft} spots remaining`}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Direct artisan support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="syllabus" className="space-y-6">
          <TabsList>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="syllabus">
            <Card>
              <CardHeader>
                <CardTitle>Course Syllabus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skill.syllabus.map((module, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-unilorin-purple text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{module}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {skill.requirements.length === 0 ? (
                  <p className="text-muted-foreground">No specific requirements for this skill.</p>
                ) : (
                  <ul className="space-y-2">
                    {skill.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Reviews feature coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
