"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArtisanCard as ProviderCard } from "@/components/marketplace/artisan-card"
import { SearchFilters } from "@/components/marketplace/search-filters"
import { CategoryGrid } from "@/components/marketplace/category-grid"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { mockDatabase } from "@/lib/mock-data" // Fallback for development
import type { Provider, Category } from "@/lib/types"
import { List, Users, Star, Clock, TrendingUp, Filter, LayoutGrid } from "lucide-react"

interface FilterState {
  search: string
  category: string
  location: string
  minRating: number
  experience: string
  availability: string
}

export default function MarketplacePage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [error, setError] = useState<string | null>(null)
  const [useDatabase, setUseDatabase] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltersVisible, setIsFiltersVisible] = useState(true)
  const [stats, setStats] = useState({
    totalProviders: 0,
    totalServices: 0,
    avgRating: 0,
    activeToday: 0
  })

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Temporarily use mock data directly for faster loading
        // TODO: Re-enable database connection after schema is deployed
        console.log('Using mock data for faster loading...')
        
        const [providersData, categoriesData] = await Promise.all([
          mockDatabase.getProviders(),
          mockDatabase.getCategories(),
        ])
        
        setProviders(providersData)
        setFilteredProviders(providersData)
        setCategories(categoriesData)
        setUseDatabase(false)
        
        // Calculate stats from mock data
        setStats({
          totalProviders: providersData.length,
          totalServices: providersData.reduce((acc: number, provider) => acc + (provider.portfolio?.length || provider.specialization?.length || 0), 0),
          avgRating: providersData.length > 0 
            ? providersData.reduce((acc: number, provider) => acc + provider.rating, 0) / providersData.length 
            : 0,
          activeToday: Math.floor(providersData.length * 0.7) // Estimate 70% active today
        })
        
        console.log(`Loaded ${providersData.length} providers and ${categoriesData.length} categories from mock data`)
        
      } catch (error) {
        console.error("Failed to load marketplace data:", error)
        setError('Failed to load data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleFiltersChange = async (filters: FilterState) => {
    // Use client-side filtering since we're using mock data
    clientSideFilter(filters)
  }

  const clientSideFilter = (filters: FilterState) => {
    let filtered = [...providers]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(provider =>
        provider.firstName.toLowerCase().includes(searchTerm) ||
        provider.lastName.toLowerCase().includes(searchTerm) ||
        provider.businessName.toLowerCase().includes(searchTerm) ||
        provider.specialization.some(service => service.toLowerCase().includes(searchTerm)) ||
        (provider.portfolio && provider.portfolio.some((item) => item.title?.toLowerCase().includes(searchTerm)))
      )
    }

    // Category filter
    if (filters.category !== "All Categories") {
      filtered = filtered.filter(provider =>
        provider.specialization.some(spec => {
          if (filters.category === "Fashion & Tailoring") {
            return spec.toLowerCase().includes('fashion') || 
                   spec.toLowerCase().includes('tailoring') || 
                   spec.toLowerCase().includes('sewing')
          }
          if (filters.category === "Electronics & Technology") {
            return spec.toLowerCase().includes('electronics') || 
                   spec.toLowerCase().includes('technology') ||
                   spec.toLowerCase().includes('tech') || 
                   spec.toLowerCase().includes('computer')
          }
          return spec.toLowerCase().includes(filters.category.toLowerCase())
        })
      )
    }

    // Location filter
    if (filters.location !== "All Locations") {
      filtered = filtered.filter(provider => 
        provider.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(provider => provider.rating >= filters.minRating)
    }

    // Experience filter
    if (filters.experience !== "All Experience") {
      const experienceYears = filters.experience
      filtered = filtered.filter(provider => {
        switch (experienceYears) {
          case "0-1 years":
            return provider.experience <= 1
          case "2-3 years":
            return provider.experience >= 2 && provider.experience <= 3
          case "4-5 years":
            return provider.experience >= 4 && provider.experience <= 5
          case "6-10 years":
            return provider.experience >= 6 && provider.experience <= 10
          case "10+ years":
            return provider.experience >= 10
          default:
            return true
        }
      })
    }

    // Availability filter
    if (filters.availability !== "All") {
      filtered = filtered.filter(provider => {
        if (filters.availability === "Available") {
          return provider.availability?.isAvailable
        }
        return true
      })
    }

    setFilteredProviders(filtered)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl mb-6 shadow-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
                <Skeleton className="h-16 w-3/4 mx-auto rounded-2xl" />
                <Skeleton className="h-8 w-1/2 mx-auto rounded-xl" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="p-6 bg-white border border-gray-200 shadow-lg">
                    <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-2xl" />
                    <Skeleton className="h-8 w-16 mx-auto mb-2 rounded-xl" />
                    <Skeleton className="h-4 w-20 mx-auto rounded-lg" />
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="p-6 bg-white border border-gray-200 shadow-lg">
                    <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 mx-auto rounded-lg" />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Database Status Indicator */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
          <div className="flex items-center justify-center">
            <div className="text-sm text-yellow-700">
              ⚠️ {error}
            </div>
          </div>
        </div>
      )}
      
      {!useDatabase && !error && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
          <div className="flex items-center justify-center">
            <div className="text-sm text-blue-700">
              📖 Currently using demo data for development
            </div>
          </div>
        </div>
      )}
      
      {useDatabase && !error && (
        <div className="bg-green-50 border-l-4 border-green-400 p-3">
          <div className="flex items-center justify-center">
            <div className="text-sm text-green-700">
              🗄️ Connected to Supabase database
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-x-hidden">
        {/* Premium Hero Section with Enhanced Visual Hierarchy */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-purple-50/30"></div>
          <div className="absolute inset-0 bg-dot-slate-200 opacity-40"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl">
            <div className="text-center space-y-12">
              {/* Enhanced Hero Content */}
              <div className="space-y-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-3xl"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-2xl">
                    <Users className="h-16 w-16 text-blue-600 mx-auto" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent leading-[1.1]">
                    Discover Expert<br />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Providers</span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
                    Connect with verified professionals in the UNILORIN community. 
                    <span className="block mt-2 text-slate-500">Learn new skills or hire experts for your projects.</span>
                  </p>
                </div>
              </div>

              {/* Premium Stats Cards with Enhanced Design */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
                <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
                  <CardContent className="relative p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stats.totalProviders}</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Expert Providers</div>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent"></div>
                  <CardContent className="relative p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stats.activeToday}</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Available Now</div>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent"></div>
                  <CardContent className="relative p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stats.avgRating.toFixed(1)}</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Average Rating</div>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent"></div>
                  <CardContent className="relative p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stats.totalServices}</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Skills Available</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Main Content Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl relative">
            <Tabs defaultValue="providers" className="space-y-12">
              {/* Premium Tab Navigation */}
              <div className="flex justify-center">
                <TabsList className="inline-flex bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-1.5 shadow-xl">
                  <TabsTrigger 
                    value="providers" 
                    className="relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Browse Providers
                    <Badge className="ml-2 bg-slate-100 text-slate-700 text-xs px-2 py-0.5 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      {filteredProviders.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="categories" 
                    className="relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-700"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    By Category
                  </TabsTrigger>
                </TabsList>
              </div>

            <TabsContent value="providers" className="space-y-10">
              {/* Premium Search and Filters Section */}
              <div className="relative">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white/50 to-purple-50/30"></div>
                  <CardContent className="relative p-6 sm:p-8">
                    <div className="space-y-8">
                      {/* Header Section with Enhanced Visual Design */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg rounded-2xl"></div>
                            <div className="relative p-4 bg-white rounded-2xl shadow-lg">
                              <Filter className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                              Find Expert Providers
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base font-medium">
                              Discover skilled professionals tailored to your needs
                            </p>
                          </div>
                        </div>
                        
                        {/* Enhanced Control Panel */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl h-11 px-4 sm:px-6 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">{isFiltersVisible ? 'Hide' : 'Show'} Filters</span>
                            <span className="sm:hidden">Filters</span>
                          </Button>
                          
                          {/* Premium View Mode Toggle */}
                          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl p-1 border border-slate-200 shadow-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewMode('grid')}
                              className={`h-9 w-9 p-0 rounded-lg transition-all duration-300 ${
                                viewMode === 'grid' 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                                  : 'hover:bg-slate-100 text-slate-600'
                              }`}
                            >
                              <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewMode('list')}
                              className={`h-9 w-9 p-0 rounded-lg transition-all duration-300 ${
                                viewMode === 'list' 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                                  : 'hover:bg-slate-100 text-slate-600'
                              }`}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Filters Panel */}
                      {isFiltersVisible && (
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm shadow-inner">
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-blue-50/40"></div>
                          <div className="relative p-6">
                            <SearchFilters onFiltersChange={handleFiltersChange} />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Premium Results Section */}
              <div className="space-y-8">
                {/* Enhanced Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        {filteredProviders.length} Expert{filteredProviders.length !== 1 ? 's' : ''} Available
                      </h3>
                      <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1.5 text-sm font-semibold rounded-full border border-blue-200/50">
                        of {providers.length} total
                      </Badge>
                    </div>
                  </div>
                  
                  {filteredProviders.length > 0 && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">{Math.floor(filteredProviders.length * 0.7)} available now</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Premium Results Grid/List */}
                {filteredProviders.length > 0 ? (
                  <div className={`transition-all duration-500 ${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                      : 'grid grid-cols-1 lg:grid-cols-2 gap-8'
                  }`}>
                    {filteredProviders.map((provider, index) => (
                      <div 
                        key={provider.id} 
                        className={`w-full animate-in fade-in slide-in-from-bottom duration-700 ${
                          index < 4 ? 'delay-100' : 
                          index < 8 ? 'delay-200' : 
                          index < 12 ? 'delay-300' : 'delay-500'
                        }`}
                      >
                        <ProviderCard artisan={provider} />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Enhanced Empty State
                  <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-blue-50/40"></div>
                    <CardContent className="relative p-12 sm:p-16 text-center">
                      <div className="space-y-8">
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-200/50 to-slate-300/50 blur-xl rounded-3xl"></div>
                          <div className="relative w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-slate-200/50">
                            <Users className="h-12 w-12 text-slate-400" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                            No providers match your criteria
                          </h3>
                          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                            Try adjusting your search terms or filters to discover more skilled professionals in our community.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                          <Button 
                            variant="outline" 
                            onClick={() => window.location.reload()}
                            className="h-12 px-8 text-base font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Clear All Filters
                          </Button>
                          <Button 
                            variant="default" 
                            onClick={() => setIsFiltersVisible(true)}
                            className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Refine Search
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-10">
              {/* Premium Categories Section */}
              <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white/50 to-blue-50/30"></div>
                <CardContent className="relative p-8 sm:p-12">
                  <div className="text-center space-y-8 mb-12">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl rounded-3xl"></div>
                      <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-2xl">
                        <LayoutGrid className="h-12 w-12 text-purple-600 mx-auto" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-700 to-slate-900 bg-clip-text text-transparent">
                        Browse by Category
                      </h2>
                      <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Explore skilled providers organized by their expertise and specializations
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Categories Grid Container */}
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-purple-50/40"></div>
                    <div className="relative p-6 sm:p-8">
                      <CategoryGrid categories={categories} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
