"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getServices, getUsers } from "@/lib/storage"
import { Service } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { 
  Search, 
  Star, 
  Grid, 
  List,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Enhanced service categories for better filtering
const SERVICE_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: Grid },
  { id: 'carpentry', name: 'Carpentry & Woodwork', icon: Briefcase },
  { id: 'plumbing', name: 'Plumbing & Water Systems', icon: Briefcase },
  { id: 'electrical', name: 'Electrical Work', icon: Briefcase },
  { id: 'construction', name: 'Masonry & Construction', icon: Briefcase },
  { id: 'painting', name: 'Painting & Decoration', icon: Briefcase },
  { id: 'welding', name: 'Welding & Metal Work', icon: Briefcase },
  { id: 'fashion', name: 'Tailoring & Fashion Design', icon: Briefcase },
  { id: 'beauty', name: 'Hair Styling & Beauty', icon: Briefcase },
  { id: 'automotive', name: 'Auto Repair & Mechanics', icon: Briefcase },
  { id: 'electronics', name: 'Electronics Repair', icon: Briefcase },
  { id: 'tech', name: 'Phone & Computer Repair', icon: Briefcase },
  { id: 'catering', name: 'Catering & Food Services', icon: Briefcase },
  { id: 'photography', name: 'Photography & Videography', icon: Briefcase },
  { id: 'design', name: 'Graphic Design & Branding', icon: Briefcase },
  { id: 'web', name: 'Web Development & Tech', icon: Briefcase },
  { id: 'tutoring', name: 'Tutoring & Education', icon: Briefcase },
  { id: 'cleaning', name: 'Cleaning & Maintenance', icon: Briefcase },
  { id: 'events', name: 'Event Planning & Management', icon: Briefcase },
  { id: 'agriculture', name: 'Agriculture & Farming', icon: Briefcase },
  { id: 'crafts', name: 'Handicrafts & Arts', icon: Briefcase },
  { id: 'music', name: 'Music & Entertainment', icon: Briefcase },
  { id: 'fitness', name: 'Fitness & Sports Training', icon: Briefcase },
  { id: 'other', name: 'Other Services', icon: Briefcase }
]

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get all services and users from storage
      const allServices = getServices()
      const allUsers = getUsers()

      // Filter for active services from verified artisans only
      const activeServices = allServices
        .filter(service => 
          service.isActive && 
          service.status === 'active'
        )
        .map(service => {
          // Find the service provider
          const provider = allUsers.find(user => user.id === service.userId)
          return {
            ...service,
            user: provider
          }
        })
        .filter(service => 
          service.user && 
          service.user.accountType === 'artisan' && 
          service.user.verificationStatus === 'verified' &&
          service.user.isVerified
        )

      setServices(activeServices)
    } catch (err) {
      console.error("Error fetching marketplace data:", err)
      setError("Failed to load marketplace data. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load marketplace services",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredServices = useMemo(() => {
    let filtered = [...services]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.user?.fullName.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query) ||
          service.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => 
        service.category.toLowerCase() === selectedCategory ||
        service.subcategory?.toLowerCase() === selectedCategory
      )
    }

    // Filter by price range
    if (priceRange !== "all") {
      filtered = filtered.filter(service => {
        const price = service.priceRange.toLowerCase()
        switch (priceRange) {
          case 'budget': return price.includes('₦1,000') || price.includes('₦2,000') || price.includes('₦3,000')
          case 'mid': return price.includes('₦5,000') || price.includes('₦7,000') || price.includes('₦10,000')
          case 'premium': return price.includes('₦15,000') || price.includes('₦20,000') || price.includes('₦25,000')
          default: return true
        }
      })
    }

    // Filter by rating
    if (ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter)
      filtered = filtered.filter(service => 
        service.user && service.user.rating >= minRating
      )
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "rating":
          return (b.user?.rating || 0) - (a.user?.rating || 0)
        case "price-low":
          return extractPriceNumber(a.priceRange) - extractPriceNumber(b.priceRange)
        case "price-high":
          return extractPriceNumber(b.priceRange) - extractPriceNumber(a.priceRange)
        case "popular":
          return (b.viewsCount || 0) - (a.viewsCount || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [services, searchQuery, selectedCategory, sortBy, priceRange, ratingFilter])

  const extractPriceNumber = (priceRange: string): number => {
    const numbers = priceRange.match(/\d+/g)
    return numbers ? parseInt(numbers[0]) : 0
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`)
  }

  const handleContactArtisan = (service: Service) => {
    if (service.user?.whatsappNumber) {
      const message = `Hi ${service.user.fullName}! I'm interested in your service: "${service.title}". Can we discuss the details?`
      const whatsappUrl = `https://wa.me/${service.user.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const getServiceImage = (service: Service) => {
    return service.images && service.images.length > 0 
      ? service.images[0] 
      : '/placeholder.jpg'
  }

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : 'New'
  }

  const categoryOptions = useMemo(() => {
    const allOption = { value: "all", label: "All Categories", count: services.length }
    const categoryOptions = SERVICE_CATEGORIES.slice(1).map((category) => ({
      value: category.id,
      label: category.name,
      count: services.filter((s) => 
        s.category.toLowerCase() === category.id || 
        s.subcategory?.toLowerCase() === category.id
      ).length,
    }))
    return [allOption, ...categoryOptions.filter(opt => opt.count > 0)]
  }, [services])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading marketplace services...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchData}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">TalentNest Marketplace</h1>
            <p className="text-xl mb-8 opacity-90">
              Discover skilled artisans and quality services in your campus community
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for services, skills, or artisans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-black"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12 text-black">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Budget (₦1K-3K)</SelectItem>
                <SelectItem value="mid">Mid-range (₦5K-10K)</SelectItem>
                <SelectItem value="premium">Premium (₦15K+)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredServices.length} of {services.length} services
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          {(searchQuery || selectedCategory !== 'all' || priceRange !== 'all' || ratingFilter !== 'all') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setPriceRange('all')
                setRatingFilter('all')
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>

        {/* Services Grid/List */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory !== 'all' || priceRange !== 'all' || ratingFilter !== 'all'
                ? "Try adjusting your search criteria or browse different categories"
                : "No verified artisan services are currently available"}
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setPriceRange('all')
              setRatingFilter('all')
            }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredServices.map((service) => (
              <Card 
                key={service.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}
                onClick={() => handleServiceClick(service.id)}
              >
                {/* Service Image */}
                <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full'}`}>
                  <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    <Image
                      src={getServiceImage(service)}
                      alt={service.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.jpg'
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={service.status === 'active' ? 'default' : 'secondary'}
                        className="bg-white text-gray-800"
                      >
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Artisan Info */}
                    {service.user && (
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={service.user.profileImageUrl} />
                          <AvatarFallback>
                            {getInitials(service.user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{service.user.fullName}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">
                                {formatRating(service.user.rating)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600">
                              {service.user.totalReviews} reviews
                            </span>
                            {service.user.isVerified && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  ✓ Verified
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Service Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Price Range:</span>
                        <span className="font-semibold text-green-600">{service.priceRange}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="text-gray-800">{service.deliveryTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Views:</span>
                        <span className="text-gray-600">{service.viewsCount || 0}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {service.tags.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {service.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link href={`/services/${service.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {service.user?.whatsappNumber && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-green-600 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContactArtisan(service)
                          }}
                        >
                          Chat
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {filteredServices.length >= 12 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Services
            </Button>
          </div>
        )}
      </div>

      {/* WhatsApp Float Button - Support Contact */}
      <WhatsAppButton 
        phoneNumber="+2348123456789"
        message="Hi! I need help with the TalentNest marketplace."
      />
      
      <Footer />
    </div>
  )
}
