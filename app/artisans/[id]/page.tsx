"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Clock, Users, Award, Calendar } from "lucide-react"
import { mockDatabase } from "@/lib/mock-data"
import type { Artisan, Skill, Review } from "@/lib/types"
import Link from "next/link"

export default function ArtisanProfilePage() {
  const params = useParams()
  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadArtisanData = async () => {
      if (!params.id) return

      try {
        const artisanData = await mockDatabase.getArtisanById(params.id as string)
        if (artisanData) {
          setArtisan(artisanData)
          // In a real app, these would be separate API calls
          const skillsData = await mockDatabase.getSkills()
          const artisanSkills = skillsData.filter((skill) => skill.artisanId === artisanData.id)
          setSkills(artisanSkills)
        }
      } catch (error) {
        console.error("Failed to load artisan data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadArtisanData()
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

  if (!artisan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artisan Not Found</h1>
            <p className="text-muted-foreground mb-4">The artisan you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const initials = `${artisan.firstName[0]}${artisan.lastName[0]}`

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={artisan.profileImage || "/placeholder.svg"}
                    alt={`${artisan.firstName} ${artisan.lastName}`}
                  />
                  <AvatarFallback className="bg-unilorin-purple text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">
                        {artisan.firstName} {artisan.lastName}
                      </h1>
                      <p className="text-xl text-muted-foreground font-medium mb-2">{artisan.businessName}</p>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{artisan.rating}</span>
                          <span className="text-muted-foreground">({artisan.totalReviews} reviews)</span>
                        </div>
                        {artisan.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Award className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button>Contact Artisan</Button>
                      <Button variant="outline">Message</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{artisan.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{artisan.experience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{skills.length} skills offered</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="skills">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Available Skills</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {artisan.specialization.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {skills.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No skills available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{skill.title}</CardTitle>
                            <Badge variant="outline" className="mt-2">
                              {skill.difficulty}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-unilorin-purple">₦{skill.price.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{skill.duration}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{skill.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {skill.currentStudents}/{skill.maxStudents} enrolled
                          </span>
                          <Button size="sm" asChild>
                            <Link href={`/skills/${skill.id}`}>Learn More</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Portfolio</h2>

              {artisan.portfolio.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No portfolio items available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artisan.portfolio.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Completed {item.completedAt.toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Reviews & Ratings</h2>

              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Reviews feature coming soon.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
