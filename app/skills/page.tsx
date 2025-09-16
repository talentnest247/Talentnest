"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getUsers } from "@/lib/storage"
import type { User } from "@/lib/types"
import { Search, Star, Users, Filter } from "lucide-react"

// Comprehensive skills categories
const SKILL_CATEGORIES = {
  "Design & Creative": [
    "Graphic Design", "UI/UX Design", "Logo Design", "Brand Identity", "Typography",
    "Print Design", "Digital Art", "Illustration", "Photo Editing", "Video Editing",
    "Animation", "3D Modeling", "Web Design", "Mobile App Design", "Fashion Design"
  ],
  "Technology & Programming": [
    "Web Development", "Mobile App Development", "Python Programming", "JavaScript",
    "React.js", "Node.js", "Database Management", "API Development", "DevOps",
    "Machine Learning", "Data Science", "Cybersecurity", "Game Development",
    "WordPress Development", "E-commerce Development"
  ],
  "Content & Writing": [
    "Content Writing", "Copywriting", "Technical Writing", "Creative Writing",
    "Blog Writing", "Social Media Content", "SEO Writing", "Academic Writing",
    "Proofreading", "Translation", "Voice Over", "Podcast Production", "Scriptwriting"
  ],
  "Marketing & Business": [
    "Digital Marketing", "Social Media Marketing", "SEO", "Content Marketing",
    "Email Marketing", "Market Research", "Business Planning", "Financial Analysis",
    "Project Management", "Sales", "Customer Service", "Brand Strategy", "PPC Advertising"
  ],
  "Photography & Video": [
    "Portrait Photography", "Event Photography", "Product Photography", "Drone Photography",
    "Video Production", "Video Editing", "Live Streaming", "Documentary Making",
    "Commercial Photography", "Wedding Photography", "Food Photography"
  ],
  "Music & Audio": [
    "Music Production", "Audio Editing", "Sound Design", "Mixing & Mastering",
    "Voiceover", "Podcast Editing", "Jingle Creation", "Beat Making", "Live Sound",
    "Music Composition"
  ],
  "Education & Training": [
    "Tutoring", "Online Teaching", "Course Creation", "Curriculum Development",
    "Language Teaching", "Math Tutoring", "Science Tutoring", "Test Preparation",
    "Skill Training", "Workshop Facilitation"
  ],
  "Personal Services": [
    "Event Planning", "Personal Shopping", "Virtual Assistant", "Data Entry",
    "Research Services", "Administrative Support", "Customer Support", "Consulting",
    "Life Coaching", "Fitness Training"
  ]
}

export default function SkillsPage() {
  const router = useRouter()
  const [allArtisans, setAllArtisans] = useState<User[]>([])
  const [filteredArtisans, setFilteredArtisans] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSkill, setSelectedSkill] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    // Get all verified artisans
    const users = getUsers()
    const verifiedArtisans = users.filter(
      user => user.accountType === "artisan" && user.verificationStatus === "verified"
    )
    setAllArtisans(verifiedArtisans)
    setFilteredArtisans(verifiedArtisans)
  }, [])

  useEffect(() => {
    const filterArtisans = () => {
      let filtered = [...allArtisans]

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(artisan =>
          artisan.fullName.toLowerCase().includes(query) ||
          artisan.skills.some(skill => skill.toLowerCase().includes(query)) ||
          artisan.bio?.toLowerCase().includes(query)
        )
      }

      // Category filter
      if (selectedCategory !== "all") {
        const categorySkills = SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES]
        filtered = filtered.filter(artisan =>
          artisan.skills.some(skill => 
            categorySkills.some(catSkill => 
              skill.toLowerCase().includes(catSkill.toLowerCase()) ||
              catSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        )
      }

      // Specific skill filter
      if (selectedSkill !== "all") {
        filtered = filtered.filter(artisan =>
          artisan.skills.some(skill => 
            skill.toLowerCase().includes(selectedSkill.toLowerCase()) ||
            selectedSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.rating - a.rating
          case "reviews":
            return b.totalReviews - a.totalReviews
          case "name":
            return a.fullName.localeCompare(b.fullName)
          default:
            return 0
        }
      })

      setFilteredArtisans(filtered)
    }

    filterArtisans()
  }, [searchQuery, selectedCategory, selectedSkill, sortBy, allArtisans])

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const getCategorySkills = () => {
    if (selectedCategory === "all") return []
    return SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES] || []
  }

  const getAllSkills = () => {
    return Object.values(SKILL_CATEGORIES).flat().sort()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Skills Catalog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our talented artisans by skills and expertise. Find the perfect person for your project.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, skills, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.keys(SKILL_CATEGORIES).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Specific Skill</label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Skills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      {selectedCategory !== "all" ? (
                        getCategorySkills().map(skill => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))
                      ) : (
                        getAllSkills().map(skill => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      setSelectedSkill("all")
                      setSortBy("rating")
                    }}
                    className="w-full"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <Users className="w-4 h-4 inline mr-1" />
            Showing {filteredArtisans.length} of {allArtisans.length} verified artisans
          </p>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((artisan) => (
            <Card key={artisan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={artisan.profileImageUrl || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(artisan.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{artisan.fullName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {artisan.faculty} • {artisan.level}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {artisan.rating.toFixed(1)} ({artisan.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Bio */}
                {artisan.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {artisan.bio}
                  </p>
                )}

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {artisan.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {artisan.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{artisan.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Experience */}
                {artisan.experience && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Experience</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {artisan.experience}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/marketplace?artisan=${artisan.id}`)}
                    className="flex-1"
                  >
                    View Services
                  </Button>
                  
                  {artisan.whatsappNumber && (
                    <WhatsAppButton
                      phoneNumber={artisan.whatsappNumber}
                      message={`Hi ${artisan.fullName}! I found your profile on TalentNest and I'm interested in your services. Can we discuss my project requirements?`}
                      variant="default"
                      size="sm"
                    >
                      Chat
                    </WhatsAppButton>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredArtisans.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No artisans found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or browse all categories.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedSkill("all")
                  }}
                >
                  Clear Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Categories Overview */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Skills Categories</CardTitle>
            <p className="text-sm text-muted-foreground">
              Explore different skill categories to find the right expertise for your project.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm">{category}</h4>
                  <div className="flex flex-wrap gap-1">
                    {skills.slice(0, 3).map(skill => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-secondary"
                        onClick={() => {
                          setSelectedCategory(category)
                          setSelectedSkill(skill)
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                    {skills.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs cursor-pointer"
                        onClick={() => setSelectedCategory(category)}
                      >
                        +{skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
