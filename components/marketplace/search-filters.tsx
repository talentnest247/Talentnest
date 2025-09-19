"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ChevronDown, X, MapPin, Star, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterState {
  search: string
  category: string
  location: string
  minRating: number
  experience: string
  availability: string
}

export interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

const categories = [
  "All Categories",
  "Fashion & Tailoring",
  "Electronics & Technology",
  "Beauty & Wellness",
  "Arts & Crafts",
  "Food & Catering",
  "Construction & Repair",
  "Photography & Media",
  "Agriculture & Farming",
  "Business & Finance",
  "Other"
]

const locations = [
  "All Locations",
  "Ilorin East",
  "Ilorin West", 
  "Ilorin South",
  "Asa",
  "Moro",
  "Offa",
  "Oyun",
  "Ifelodun",
  "Isin",
  "Ekiti",
  "Kaiama",
  "Baruten",
  "Edu",
  "Pategi",
  "Irepodun",
  "Online/Remote"
]

const experienceLevels = [
  "All Experience",
  "0-1 years",
  "2-3 years", 
  "4-5 years",
  "6-10 years",
  "10+ years"
]

const availabilityOptions = [
  "All",
  "Available Now",
  "Available This Week",
  "Available This Month"
]

export function SearchFilters({ onFiltersChange, className }: SearchFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    category: "All Categories",
    location: "All Locations",
    minRating: 0,
    experience: "All Experience",
    availability: "All"
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Initial call to parent component with default filters
  useEffect(() => {
    onFiltersChange(filters)
  }, []) // Only run on mount

  useEffect(() => {
    // Update active filters for badge display
    const active = []
    if (filters.search) active.push(`Search: ${filters.search}`)
    if (filters.category !== "All Categories") active.push(`Category: ${filters.category}`)
    if (filters.location !== "All Locations") active.push(`Location: ${filters.location}`)
    if (filters.minRating > 0) active.push(`${filters.minRating}+ Stars`)
    if (filters.experience !== "All Experience") active.push(`Experience: ${filters.experience}`)
    if (filters.availability !== "All") active.push(`Availability: ${filters.availability}`)
    
    setActiveFilters(active)
  }, [filters])

  const handleFilterChange = (key: string, value: string | number) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilter = (filterText: string) => {
    if (filterText.startsWith("Search:")) {
      handleFilterChange("search", "")
    } else if (filterText.startsWith("Category:")) {
      handleFilterChange("category", "All Categories")
    } else if (filterText.startsWith("Location:")) {
      handleFilterChange("location", "All Locations")
    } else if (filterText.includes("Stars")) {
      handleFilterChange("minRating", 0)
    } else if (filterText.startsWith("Experience:")) {
      handleFilterChange("experience", "All Experience")
    } else if (filterText.startsWith("Availability:")) {
      handleFilterChange("availability", "All")
    }
  }

  const clearAllFilters = () => {
    const newFilters = {
      search: "",
      category: "All Categories",
      location: "All Locations", 
      minRating: 0,
      experience: "All Experience",
      availability: "All"
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search artisans, skills, or services..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10 pr-4 h-12 text-base bg-white border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl shadow-sm"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-lg h-10 px-4"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 bg-primary text-white text-xs h-5 min-w-[20px] rounded-full">
                  {activeFilters.length}
                </Badge>
              )}
              <ChevronDown className={cn("h-4 w-4 transition-transform", isFiltersOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Filter Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filter Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      Category
                    </label>
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                      <SelectTrigger className="bg-white border-gray-200 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Location
                    </label>
                    <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                      <SelectTrigger className="bg-white border-gray-200 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Experience
                    </label>
                    <Select value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
                      <SelectTrigger className="bg-white border-gray-200 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      Minimum Rating
                    </label>
                    <Select value={filters.minRating.toString()} onValueChange={(value) => handleFilterChange("minRating", parseInt(value))}>
                      <SelectTrigger className="bg-white border-gray-200 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Ratings</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={clearAllFilters}
                      className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer pr-1 pl-3 py-1 h-7"
              onClick={() => clearFilter(filter)}
            >
              <span className="text-sm">{filter}</span>
              <X className="h-3 w-3 ml-2 hover:text-primary/80" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
