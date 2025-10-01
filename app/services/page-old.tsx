"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Briefcase
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ServiceProviderCard from "@/components/services/service-provider-card"

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
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<ServiceProvider[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceProvider[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Redirect non-authenticated users to registration
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/register?message=Please register as a student to access services")
      return
    }
  }, [user, authLoading, router])

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
        ) ||
        service.location.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [services, searchTerm, selectedCategory])

  // Show loading state while checking authentication
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show message if user is not a student
  if (user.role !== 'student') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
            <p className="text-gray-600 mb-4">Services are only available for registered students.</p>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Return to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
              src="/unilorin-logo.svg"
              alt="University of Ilorin Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              UniLorin Services Directory
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              Discover talented verified artisans offering professional services and training opportunities at University of Ilorin
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    placeholder="Search services, providers, or specializations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 border-blue-200 focus:border-blue-500">
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
              <ServiceProviderCard
                key={service.id}
                provider={service}
                onContact={(providerId) => {
                  console.log("Contact provider:", providerId)
                  // Handle contact functionality
                }}
                onFavorite={(providerId) => {
                  console.log("Favorite provider:", providerId)
                  // Handle favorite functionality
                }}
                isFavorited={false} // Would come from user's favorites
              />
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