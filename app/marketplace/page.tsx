"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { createClient } from "@/lib/supabase/client"
import { Search, Star, Grid, List } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  title: string
  description: string
  price: number
  price_type: string
  delivery_time: string
  portfolio_items: string[]
  created_at: string
  provider: {
    id: string
    full_name: string
    faculty: string
    total_rating: number
    total_reviews: number
    is_verified: boolean
  }
  category: {
    id: string
    name: string
    icon: string
  }
}

interface Category {
  id: string
  name: string
  icon: string
  is_active: boolean
}

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("service_categories")
        .select("*")
        .eq("is_active", true)
        .order("name")

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Fetch services with provider and category data
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select(`
          *,
          provider:users!services_provider_id_fkey(
            id,
            full_name,
            faculty,
            total_rating,
            total_reviews,
            is_verified
          ),
          category:service_categories!services_category_id_fkey(
            id,
            name,
            icon
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(50) // Limit for performance

      if (servicesError) throw servicesError
      setServices(servicesData || [])
    } catch (err) {
      console.error("Error fetching marketplace data:", err)
      setError("Failed to load marketplace data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [supabase])

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
          service.provider?.full_name.toLowerCase().includes(query) ||
          service.category?.name.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.category?.id === selectedCategory)
    }

    // Sort services
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "rating":
        filtered.sort((a, b) => (b.provider?.total_rating || 0) - (a.provider?.total_rating || 0))
        break
      case "price_low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price_high":
        filtered.sort((a, b) => b.price - a.price)
        break
    }

    return filtered
  }, [services, searchQuery, selectedCategory, sortBy])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const categoryOptions = useMemo(() => {
    const allOption = { value: "all", label: "All Categories", count: services.length }
    const categoryOptions = categories.map((category) => ({
      value: category.id,
      label: category.name,
      count: services.filter((s) => s.category?.id === category.id).length,
    }))
    return [allOption, ...categoryOptions]
  }, [categories, services])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">University of Ilorin Skills Marketplace</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover talented UNILORIN students offering amazing services. From digital design to artisan crafts, find
            the perfect student for your project.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search services, skills, or student names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Services Grid/List */}
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Be the first to add a service to the marketplace!"}
              </p>
              <Link href="/dashboard/services/new">
                <Button>Add Your Service</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className={viewMode === "grid" ? "p-6" : "p-4"}>
                  <div className={viewMode === "list" ? "flex gap-4" : ""}>
                    {/* Service Images */}
                    {service.portfolio_items && service.portfolio_items.length > 0 && (
                      <div className={viewMode === "grid" ? "mb-4" : "w-32 h-24 flex-shrink-0"}>
                        <img
                          src={service.portfolio_items[0] || "/placeholder.svg?height=200&width=300"}
                          alt={service.title}
                          className={`rounded-lg object-cover ${viewMode === "grid" ? "w-full h-48" : "w-full h-full"}`}
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      {/* Service Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Link href={`/services/${service.id}`}>
                            <h3 className="font-semibold text-lg hover:text-secondary transition-colors line-clamp-2">
                              {service.title}
                            </h3>
                          </Link>
                          <Badge variant="secondary" className="mt-1">
                            {service.category?.name}
                          </Badge>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-secondary">₦{service.price}</p>
                          <p className="text-xs text-muted-foreground">{service.delivery_time}</p>
                        </div>
                      </div>

                      {/* Service Description */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{service.description}</p>

                      {/* Provider Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="text-xs">
                              {service.provider ? getInitials(service.provider.full_name) : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-medium">{service.provider?.full_name || "Unknown User"}</p>
                              {service.provider?.is_verified && (
                                <Badge variant="outline" className="text-xs px-1">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">
                                {service.provider?.total_rating?.toFixed(1) || "0.0"} (
                                {service.provider?.total_reviews || 0})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <Link href={`/services/${service.id}`}>
                          <Button className="w-full" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
