"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SkillCard } from "@/components/skills/skill-card"
import { SearchFilters, type FilterState } from "@/components/marketplace/search-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { mockDatabase } from "@/lib/mock-data"
import type { Skill, Artisan, Category } from "@/lib/types"
import { Grid, List, BookOpen, Users, Award, Clock, TrendingUp, Star } from "lucide-react"

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSkills: 0,
    totalCategories: 0,
    avgPrice: 0,
    popularSkills: 0
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [skillsData, artisansData, categoriesData] = await Promise.all([
          mockDatabase.getSkills(),
          mockDatabase.getArtisans(),
          mockDatabase.getCategories(),
        ])
        setSkills(skillsData)
        setFilteredSkills(skillsData)
        setArtisans(artisansData)
        setCategories(categoriesData)
        
        // Calculate stats
        setStats({
          totalSkills: skillsData.length,
          totalCategories: categoriesData.length,
          avgPrice: skillsData.reduce((acc, skill) => acc + skill.price, 0) / skillsData.length,
          popularSkills: skillsData.filter(skill => skill.currentStudents > 10).length
        })
      } catch (error) {
        console.error("Failed to load skills data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleFiltersChange = (filters: FilterState) => {
    let filtered = [...skills]

    // Handle search
    if (filters.search && filters.search.trim()) {
      filtered = filtered.filter(
        (skill) =>
          skill.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          skill.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          skill.category.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Handle category filter
    if (filters.category && filters.category !== "All Categories") {
      filtered = filtered.filter((skill) => skill.category === filters.category)
    }

    // Handle location filter
    if (filters.location && filters.location !== "All Locations") {
      // For skills, we can filter by the artisan's location
      filtered = filtered.filter((skill) => {
        const artisan = getArtisanById(skill.artisanId)
        return artisan?.location === filters.location
      })
    }

    // Handle rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter((skill) => skill.instructor.rating >= filters.minRating)
    }

    // Handle experience filter
    if (filters.experience && filters.experience !== "All Experience") {
      // Filter by difficulty level as a proxy for experience requirement
      const difficultyMap: { [key: string]: string[] } = {
        "Beginner": ["beginner"],
        "Intermediate": ["beginner", "intermediate"],
        "Advanced": ["intermediate", "advanced"],
      }

      if (difficultyMap[filters.experience]) {
        filtered = filtered.filter((skill) => difficultyMap[filters.experience].includes(skill.difficulty))
      }
    }

    // Handle availability filter
    if (filters.availability && filters.availability !== "All") {
      // For skills, filter by current availability status
      if (filters.availability === "Available") {
        filtered = filtered.filter((skill) => skill.currentStudents < skill.maxStudents)
      } else if (filters.availability === "Full") {
        filtered = filtered.filter((skill) => skill.currentStudents >= skill.maxStudents)
      }
    }

    setFilteredSkills(filtered)
  }

  const getArtisanById = (artisanId: string) => artisans.find((a) => a.id === artisanId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary animate-spin [animation-delay:0.5s] mx-auto"></div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold animate-pulse">Loading Skills</h2>
                <p className="text-muted-foreground animate-pulse">Discovering amazing learning opportunities...</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <Skeleton className="h-32 w-full mb-4 rounded-lg" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Stats */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-12 animate-in slide-in-from-bottom duration-1000">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Skills Marketplace
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Learn from expert artisans and master new skills. Start your learning journey today.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <Card className="glass-card hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-200">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold text-primary">{stats.totalSkills}</div>
                    <div className="text-sm text-muted-foreground">Available Skills</div>
                  </CardContent>
                </Card>
                <Card className="glass-card hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-300">
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold text-primary">{stats.totalCategories}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </CardContent>
                </Card>
                <Card className="glass-card hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-400">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold text-primary">₦{stats.avgPrice.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Avg Price</div>
                  </CardContent>
                </Card>
                <Card className="glass-card hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-500">
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold text-primary">{stats.popularSkills}</div>
                    <div className="text-sm text-muted-foreground">Popular Skills</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="space-y-8">
            <div className="bg-white/50 dark:bg-muted/50 backdrop-blur rounded-xl p-6 border border-white/20 animate-in fade-in slide-in-from-bottom duration-700">
              <SearchFilters onFiltersChange={handleFiltersChange} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30 dark:bg-muted/30 backdrop-blur rounded-lg p-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              <div className="flex items-center space-x-4">
                <Badge {...({ variant: "secondary" } as any)} className="bg-primary/10 text-primary">
                  {filteredSkills.length} skills found
                </Badge>
                <p className="text-sm text-muted-foreground">
                  from {skills.length} total
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  {...({ variant: viewMode === "grid" ? "default" : "outline", size: "sm" } as any)}
                  onClick={() => setViewMode("grid")}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  {...({ variant: viewMode === "list" ? "default" : "outline", size: "sm" } as any)}
                  onClick={() => setViewMode("list")}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filteredSkills.length === 0 ? (
              <div className="text-center py-16 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No skills found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria to find more skills</p>
                  </div>
                  <Button
                    {...({ variant: "outline" } as any)}
                    onClick={() => {
                      setFilteredSkills(skills)
                      // Reset filters by calling handleFiltersChange with default filters
                      handleFiltersChange({
                        search: "",
                        category: "All Categories",
                        location: "All Locations",
                        minRating: 0,
                        experience: "All Experience",
                        availability: "All"
                      })
                    }}
                    className="hover:scale-105 transition-all duration-200"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
              }>
                {filteredSkills.map((skill, index) => {
                  const artisan = getArtisanById(skill.artisanId)
                  return (
                    <div 
                      key={skill.id}
                      className={`animate-in fade-in slide-in-from-bottom duration-500 ${
                        index < 3 ? 'delay-100' :
                        index < 6 ? 'delay-200' :
                        index < 9 ? 'delay-300' : 'delay-500'
                      }`}
                    >
                      <SkillCard skill={skill} artisan={artisan} showArtisan={true} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
