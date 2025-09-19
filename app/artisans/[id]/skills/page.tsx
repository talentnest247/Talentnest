"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Star, MapPin, Clock, Users, Award, Calendar, BookOpen, Trophy } from "lucide-react"
import { mockDatabase } from "@/lib/mock-data"
import type { Artisan, Skill } from "@/lib/types"
import Link from "next/link"

export default function ArtisanSkillsPage() {
  const params = useParams()
  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadArtisanData = async () => {
      if (!params.id) return

      try {
        const artisanData = await mockDatabase.getArtisanById(params.id as string)
        if (artisanData) {
          setArtisan(artisanData)
          // Load skills offered by this artisan
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            {/* Header Skeleton */}
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </Card>
            
            {/* Skills Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artisan Not Found</h1>
            <p className="text-gray-600 mb-8">The artisan you're looking for doesn't exist.</p>
            <Link href="/marketplace">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            <span>/</span>
            <Link href={`/artisans/${artisan.id}`} className="hover:text-primary">
              {artisan.firstName} {artisan.lastName}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Skills</span>
          </nav>
          
          {/* Artisan Header */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                  <AvatarImage
                    src={artisan.profileImage || "/placeholder.svg"}
                    alt={`${artisan.firstName} ${artisan.lastName}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {artisan.firstName[0]}{artisan.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {artisan.firstName} {artisan.lastName}'s Skills
                  </h1>
                  <p className="text-gray-600">{artisan.businessName}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{artisan.rating}</span>
                      <span className="text-sm text-gray-500">({artisan.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{artisan.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/artisans/${artisan.id}`}>
                    <Button variant="outline">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Skills Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Skills Offered ({skills.length})
              </h2>
            </div>
            
            {skills.length === 0 ? (
              <Card className="p-8 text-center border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Skills Listed Yet</h3>
                <p className="text-gray-600 mb-4">
                  {artisan.firstName} hasn't added any skills to offer yet.
                </p>
                <p className="text-sm text-gray-500">
                  Check back later or contact them directly for available services.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill) => (
                  <Card key={skill.id} className="border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            {skill.title}
                          </CardTitle>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Skill Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{skill.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-gray-600">Level:</span>
                            <span className="font-medium capitalize">{skill.difficulty}</span>
                          </div>
                        </div>
                        
                        {/* Category and Skills */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            {skill.category}
                          </Badge>
                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                            ₦{skill.price.toLocaleString()}
                          </Badge>
                        </div>
                        
                        {/* Enrollment Button */}
                        <div className="pt-2">
                          <Link href={`/skills/${skill.id}`} className="w-full">
                            <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200">
                              <Trophy className="h-4 w-4 mr-2" />
                              Learn This Skill
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
