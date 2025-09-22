"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  MessageSquare,
  ExternalLink,
  Briefcase
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ServiceProvider {
  id: string
  name: string
  businessName: string
  specialization: string[]
  location: string
  rating: number
  totalReviews: number
  verified: boolean
  availableForLearning: boolean
  responseTime: string
  portfolio: string[]
  pricing: {
    serviceRate?: number
    trainingRate?: number
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceProvider[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceProvider[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for services according to PRD
  useEffect(() => {
    const mockServices: ServiceProvider[] = [
      {
        id: "1",
        name: "Amina Hassan",
        businessName: "Amina's Fashion Studio",
        specialization: ["Fashion Design", "Tailoring", "Traditional Wear"],
        location: "Kwara State",
        rating: 4.8,
        totalReviews: 47,
        verified: true,
        availableForLearning: true,
        responseTime: "Usually responds within 2 hours",
        portfolio: ["/fashion1.jpg", "/fashion2.jpg"],
        pricing: { serviceRate: 15000, trainingRate: 8000 }
      },
      {
        id: "2", 
        name: "Ibrahim Musa",
        businessName: "TechCraft Solutions",
        specialization: ["Web Development", "Mobile Apps", "Graphics Design"],
        location: "Kwara State",
        rating: 4.9,
        totalReviews: 63,
        verified: true,
        availableForLearning: true,
        responseTime: "Usually responds within 1 hour",
        portfolio: ["/tech1.jpg", "/tech2.jpg"],
        pricing: { serviceRate: 25000, trainingRate: 12000 }
      },
      {
        id: "3",
        name: "Khadijah Abubakar", 
        businessName: "Beauty by Khadijah",
        specialization: ["Hair Styling", "Makeup", "Beauty Consulting"],
        location: "Kwara State",
        rating: 4.7,
        totalReviews: 38,
        verified: false,
        availableForLearning: true,
        responseTime: "Usually responds within 3 hours",
        portfolio: ["/beauty1.jpg", "/beauty2.jpg"],
        pricing: { serviceRate: 8000, trainingRate: 5000 }
      }
    ]

    setServices(mockServices)
    setFilteredServices(mockServices)
    setIsLoading(false)
  }, [])

  // Filter services based on search and category
  useEffect(() => {
    let filtered = services

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.specialization.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(service =>
        service.specialization.some(spec => 
          spec.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      )
    }

    setFilteredServices(filtered)
  }, [searchTerm, selectedCategory, services])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
            <p>Loading services...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <Image
              src="/images/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Services Directory
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover talented student service providers offering professional services and training opportunities at UNILORIN
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services, providers, or specializations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fashion">Fashion & Tailoring</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="beauty">Beauty & Styling</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="writing">Writing & Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {service.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-blue-700">{service.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{service.businessName}</p>
                      </div>
                    </div>
                    {service.verified && (
                      <Badge className="bg-green-100 text-green-700">Verified</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2">
                    {service.specialization.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{service.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({service.totalReviews} reviews)
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{service.location}</span>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.responseTime}</span>
                  </div>

                  {/* Pricing */}
                  {service.pricing.serviceRate && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">From ₦{service.pricing.serviceRate.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Available for Learning Badge */}
                  {service.availableForLearning && (
                    <Badge className="bg-purple-100 text-purple-700">
                      Available for Training
                    </Badge>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Link href={`/providers/${service.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}