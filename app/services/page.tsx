"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, Star, MapPin, Phone, Heart, MessageCircle, Send, Shield, Mail, Clock
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: string
  title: string
  description: string
  price_type: 'fixed' | 'hourly' | 'negotiable'
  base_price?: number
  max_price?: number
  delivery_time?: number
  images?: string[]
  tags?: string[]
  provider: {
    id: string
    full_name: string
    avatar_url?: string
    rating_average: number
    total_reviews: number
    verification_status: string
    availability_status: string
    location_on_campus?: string
    bio?: string
    skills?: string[]
    experience_years?: number
    completed_projects?: number
    response_time?: string
    phone?: string
    whatsapp?: string
    email?: string
  }
  category: {
    id: string
    name: string
    icon?: string
  }
  reviews?: Review[]
}

interface Review {
  id: string
  user_name: string
  user_avatar?: string
  rating: number
  comment: string
  created_at: string
  images?: string[]
}

export default function EnhancedServicesPage() {
  return (
    <AuthGuard>
      <ServicesContent />
    </AuthGuard>
  )
}

function ServicesContent() {
  const { toast } = useToast()
  
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedArtisan, setSelectedArtisan] = useState<Service | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [favoriteServices, setFavoriteServices] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Mock data for demonstration
    const mockServices: Service[] = [
      {
        id: "1",
        title: "Professional Fashion Design & Tailoring",
        description: "Custom clothing design and tailoring services for all occasions. Specializing in traditional Nigerian attire, modern fashion, and alterations.",
        price_type: "fixed",
        base_price: 15000,
        delivery_time: 7,
        images: ["/fashion-design-class.png", "/traditional-agbada.png"],
        tags: ["Fashion", "Tailoring", "Custom Design", "Traditional Wear"],
        provider: {
          id: "p1",
          full_name: "Adebayo Fashola",
          avatar_url: "/professional-woman-tailor.png",
          rating_average: 4.8,
          total_reviews: 127,
          verification_status: "verified",
          availability_status: "online",
          location_on_campus: "Faculty of Arts Building",
          bio: "Professional fashion designer with 5+ years of experience. I specialize in creating unique, high-quality clothing that reflects both modern trends and traditional Nigerian culture.",
          skills: ["Fashion Design", "Pattern Making", "Embroidery", "Alterations"],
          experience_years: 5,
          completed_projects: 230,
          response_time: "Usually responds within 2 hours",
          phone: "+234 812 345 6789",
          whatsapp: "+234 812 345 6789",
          email: "adebayo.fashola@student.unilorin.edu.ng"
        },
        category: {
          id: "fashion",
          name: "Fashion & Tailoring",
          icon: "👗"
        },
        reviews: [
          {
            id: "r1",
            user_name: "Fatima Ibrahim",
            user_avatar: "/placeholder-user.jpg",
            rating: 5,
            comment: "Absolutely amazing work! Adebayo created a beautiful traditional dress for my graduation. The attention to detail and quality is outstanding.",
            created_at: "2024-12-15T10:30:00Z",
            images: ["/traditional-agbada.png"]
          },
          {
            id: "r2",
            user_name: "Michael Okonkwo",
            rating: 4,
            comment: "Great service and timely delivery. Very professional and skilled artisan.",
            created_at: "2024-12-10T14:20:00Z"
          }
        ]
      },
      {
        id: "2",
        title: "Phone & Computer Repair Services",
        description: "Expert repair services for smartphones, laptops, and computers. Quick turnaround time with quality parts and service guarantee.",
        price_type: "hourly",
        base_price: 2500,
        max_price: 15000,
        delivery_time: 2,
        images: ["/young-man-technician.png"],
        tags: ["Tech Repair", "Phone Repair", "Computer Repair", "Quick Service"],
        provider: {
          id: "p2",
          full_name: "Emmanuel Adeyemi",
          avatar_url: "/young-man-technician.png",
          rating_average: 4.9,
          total_reviews: 89,
          verification_status: "verified",
          availability_status: "online",
          location_on_campus: "Engineering Faculty",
          bio: "Tech enthusiast and certified repair specialist. I provide reliable and affordable repair services for all types of electronic devices.",
          skills: ["Phone Repair", "Laptop Repair", "Software Troubleshooting", "Data Recovery"],
          experience_years: 3,
          completed_projects: 156,
          response_time: "Usually responds within 1 hour",
          phone: "+234 803 123 4567",
          whatsapp: "+234 803 123 4567",
          email: "emmanuel.adeyemi@student.unilorin.edu.ng"
        },
        category: {
          id: "tech",
          name: "Technology",
          icon: "💻"
        },
        reviews: [
          {
            id: "r3",
            user_name: "Sarah Johnson",
            rating: 5,
            comment: "Fixed my laptop screen perfectly! Very knowledgeable and fair pricing.",
            created_at: "2024-12-12T09:15:00Z"
          }
        ]
      }
    ]

    // Set mock data
    setServices(mockServices)
    setLoading(false)
  }, [mounted])

  const openWhatsApp = (phoneNumber: string, message?: string) => {
    const baseMessage = message || `Hi! I'm interested in your services on TalentNest.`
    const encodedMessage = encodeURIComponent(baseMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const toggleFavorite = (serviceId: string) => {
    setFavoriteServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleSendMessage = () => {
    if (chatMessage.trim() && selectedArtisan) {
      // In a real app, this would send a message through your messaging system
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedArtisan.provider.full_name}`,
      })
      setChatMessage("")
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Info Banner - Explaining the Marketplace */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Welcome to TalentNest Marketplace! 🎓</h3>
                <p className="text-blue-100 text-sm">
                  <strong className="text-white">For Students:</strong> Browse services and book skilled artisans for your needs. 
                  <span className="mx-2">•</span>
                  <strong className="text-white">For Artisans:</strong> List your services and get hired by students across campus.
                </p>
              </div>
              <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold border-0 shadow-md">
                List Your Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 text-sm font-semibold shadow-lg">
              TalentNest Services Marketplace
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Browse <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Quality Services</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover a wide range of services offered by talented student artisans across UNILORIN campus. From fashion design to tech repairs, haircuts to graphic design - find what you need.
          </p>
          <div className="flex items-center justify-center gap-8 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Verified Services</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Rated by Students</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Easy Booking</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <Input
                    placeholder="Search for services, skills, or artisans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory || undefined} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48 border-blue-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fashion">Fashion & Tailoring</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                  <SelectItem value="tutoring">Tutoring</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48 border-blue-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-700 font-medium">
            <span className="text-blue-600 font-bold">{services.length}</span> services available
          </p>
          <Badge variant="outline" className="text-sm">
            All services verified
          </Badge>
        </div>

        {/* Services Grid - Focused on SERVICES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-2xl transition-all duration-300 bg-white border-2 border-gray-200 hover:border-blue-400 overflow-hidden">
              {/* Service Image with Overlay */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={service.images?.[0] || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Top Right Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white hover:bg-white shadow-lg border-0"
                    onClick={() => toggleFavorite(service.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favoriteServices.includes(service.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-700"
                      }`}
                    />
                  </Button>
                </div>
                
                {/* Bottom Left Category Badge */}
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-blue-600 text-white font-semibold px-3 py-1 shadow-lg">
                    {service.category.icon} {service.category.name}
                  </Badge>
                </div>

                {/* Delivery Time Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/95 text-gray-900 font-semibold px-3 py-1 shadow-lg">
                    <Clock className="w-3 h-3 mr-1 inline" />
                    {service.delivery_time} days
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Service Title & Description - PRIMARY FOCUS */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-xl line-clamp-2 leading-tight">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{service.description}</p>
                </div>

                {/* Artisan Info - SECONDARY */}
                <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                  <Avatar className="h-8 w-8 border-2 border-gray-200">
                    <AvatarImage src={service.provider.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">
                      {service.provider.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{service.provider.full_name}</p>
                      {service.provider.verification_status === 'verified' && (
                        <Shield className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {renderStars(service.provider.rating_average)}
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {service.provider.rating_average}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({service.provider.total_reviews})
                      </span>
                      {service.provider.availability_status === 'online' && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-xs text-green-600 font-medium">Online</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50 font-medium px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                  {service.tags && service.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 font-medium">
                      +{service.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Price and Action Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Starting from</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-600">
                        ₦{service.base_price?.toLocaleString()}
                      </span>
                      {service.price_type === 'hourly' && (
                        <span className="text-sm text-gray-500 font-medium">/hour</span>
                      )}
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                        onClick={() => setSelectedArtisan(service)}
                      >
                        View Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                      <DialogHeader className="border-b border-gray-200 pb-4">
                        <DialogTitle className="text-2xl font-bold text-blue-900">
                          {selectedArtisan?.title}
                        </DialogTitle>
                      </DialogHeader>

                      {selectedArtisan && (
                        <Tabs defaultValue="overview" className="w-full mt-4">
                          <TabsList className="grid w-full grid-cols-4 bg-blue-100 p-1 rounded-lg">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-semibold transition-all">
                              Overview
                            </TabsTrigger>
                            <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-semibold transition-all">
                              Portfolio
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-semibold transition-all">
                              Reviews ({selectedArtisan.provider.total_reviews})
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-semibold transition-all">
                              Contact
                            </TabsTrigger>
                          </TabsList>

                          {/* Overview Tab */}
                          <TabsContent value="overview" className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Artisan Profile */}
                              <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-md">
                                  <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                      <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                                        <AvatarImage src={selectedArtisan.provider.avatar_url} />
                                        <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                                          {selectedArtisan.provider.full_name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <h3 className="text-xl font-bold text-blue-900 mb-1">
                                          {selectedArtisan.provider.full_name}
                                        </h3>
                                        <p className="text-blue-700 font-medium mb-2">{selectedArtisan.category.name} Specialist</p>
                                        <div className="flex items-center flex-wrap gap-3 text-sm text-blue-600 font-medium">
                                          <div className="flex items-center">
                                            {renderStars(selectedArtisan.provider.rating_average)}
                                            <span className="ml-1 font-bold">{selectedArtisan.provider.rating_average}</span>
                                          </div>
                                          <span>•</span>
                                          <span>{selectedArtisan.provider.completed_projects} projects</span>
                                          <span>•</span>
                                          <span>{selectedArtisan.provider.experience_years} yrs exp</span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-white border-gray-200 shadow-md">
                                  <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="text-blue-900 font-bold">About This Service</CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-6">
                                    <p className="text-gray-700 mb-4 leading-relaxed">{selectedArtisan.description}</p>
                                    <p className="text-gray-700 leading-relaxed">{selectedArtisan.provider.bio}</p>
                                  </CardContent>
                                </Card>

                                <Card className="bg-white border-gray-200 shadow-md">
                                  <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="text-blue-900 font-bold">Skills & Expertise</CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-6">
                                    <div className="flex flex-wrap gap-2">
                                      {selectedArtisan.provider.skills?.map((skill, index) => (
                                        <Badge key={index} className="bg-blue-600 text-white px-3 py-1 text-sm font-medium">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Sidebar */}
                              <div className="space-y-6">
                                <Card className="bg-white border-blue-300 shadow-lg">
                                  <CardHeader className="bg-blue-50 border-b border-blue-200">
                                    <CardTitle className="text-blue-900 font-bold">Service Details</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4 p-6 bg-white">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                      <span className="text-gray-700 font-medium">Starting Price:</span>
                                      <span className="font-bold text-blue-600 text-lg">
                                        ₦{selectedArtisan.base_price?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                      <span className="text-gray-700 font-medium">Delivery Time:</span>
                                      <span className="font-semibold text-gray-900">{selectedArtisan.delivery_time} days</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                      <span className="text-gray-700 font-medium">Response Time:</span>
                                      <span className="font-semibold text-green-600">
                                        {selectedArtisan.provider.response_time}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                      <span className="text-gray-700 font-medium">Location:</span>
                                      <span className="font-semibold text-gray-900 text-right">
                                        {selectedArtisan.provider.location_on_campus}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-md">
                                  <CardContent className="p-6">
                                    <div className="text-center">
                                      <div className={`w-5 h-5 rounded-full mx-auto mb-3 shadow-lg ${
                                        selectedArtisan.provider.availability_status === 'online' ? 'bg-green-500' :
                                        selectedArtisan.provider.availability_status === 'busy' ? 'bg-yellow-500' :
                                        'bg-gray-400'
                                      }`} />
                                      <p className="font-bold text-green-900 text-lg mb-1">
                                        {selectedArtisan.provider.availability_status === 'online' ? 'Online Now' :
                                         selectedArtisan.provider.availability_status === 'busy' ? 'Busy' :
                                         'Offline'}
                                      </p>
                                      <p className="text-sm text-green-700 font-medium">
                                        {selectedArtisan.provider.response_time}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Portfolio Tab */}
                          <TabsContent value="portfolio" className="space-y-6 mt-6">
                            <Card className="bg-white border-gray-200 shadow-md">
                              <CardHeader className="bg-gray-50 border-b">
                                <CardTitle className="text-blue-900 font-bold">Portfolio Gallery</CardTitle>
                              </CardHeader>
                              <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {selectedArtisan.images?.map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-md bg-white">
                                      <Image
                                        src={image}
                                        alt={`Portfolio ${index + 1}`}
                                        fill
                                        className="object-cover hover:scale-110 transition-transform duration-300"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>

                          {/* Reviews Tab */}
                          <TabsContent value="reviews" className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-lg">
                                <CardContent className="p-6 text-center">
                                  <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {selectedArtisan.provider.rating_average}
                                  </div>
                                  <div className="flex justify-center mb-2">
                                    {renderStars(selectedArtisan.provider.rating_average)}
                                  </div>
                                  <p className="text-blue-800 font-semibold">Average Rating</p>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-lg">
                                <CardContent className="p-6 text-center">
                                  <div className="text-4xl font-bold text-green-600 mb-2">
                                    {selectedArtisan.provider.total_reviews}
                                  </div>
                                  <p className="text-green-800 font-semibold">Total Reviews</p>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 shadow-lg">
                                <CardContent className="p-6 text-center">
                                  <div className="text-4xl font-bold text-purple-600 mb-2">
                                    {selectedArtisan.provider.completed_projects}
                                  </div>
                                  <p className="text-purple-800 font-semibold">Projects Completed</p>
                                </CardContent>
                              </Card>
                            </div>

                            <div className="space-y-4">
                              {selectedArtisan.reviews?.map((review) => (
                                <Card key={review.id} className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                                  <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                      <Avatar className="h-12 w-12 border-2 border-blue-200">
                                        <AvatarImage src={review.user_avatar} />
                                        <AvatarFallback className="bg-blue-600 text-white font-bold">
                                          {review.user_name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                          <h4 className="font-bold text-blue-900">{review.user_name}</h4>
                                          <span className="text-sm text-gray-600 font-medium">
                                            {new Date(review.created_at).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="flex items-center mb-3">
                                          {renderStars(review.rating)}
                                        </div>
                                        <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                                        {review.images && (
                                          <div className="flex space-x-2 mt-4">
                                            {review.images.map((img, idx) => (
                                              <div key={idx} className="w-20 h-20 relative rounded-lg overflow-hidden border-2 border-gray-200 bg-white shadow-sm">
                                                <Image src={img} alt={`Review ${idx}`} fill className="object-cover" />
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>

                          {/* Contact Tab */}
                          <TabsContent value="contact" className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Contact Information */}
                              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-lg">
                                <CardHeader className="bg-blue-100 border-b border-blue-200">
                                  <CardTitle className="text-blue-900 font-bold">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5 p-6 bg-white">
                                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="bg-blue-600 p-3 rounded-full">
                                      <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-gray-900 text-sm">Email</p>
                                      <p className="text-blue-700 font-medium">{selectedArtisan.provider.email}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="bg-blue-600 p-3 rounded-full">
                                      <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-gray-900 text-sm">Phone</p>
                                      <p className="text-blue-700 font-medium">{selectedArtisan.provider.phone}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="bg-blue-600 p-3 rounded-full">
                                      <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-gray-900 text-sm">Campus Location</p>
                                      <p className="text-blue-700 font-medium">{selectedArtisan.provider.location_on_campus}</p>
                                    </div>
                                  </div>

                                  <div className="pt-4 space-y-3">
                                    <Button 
                                      className="w-full bg-green-600 hover:bg-green-700 shadow-md font-bold text-base py-6"
                                      onClick={() => selectedArtisan.provider.whatsapp && openWhatsApp(selectedArtisan.provider.whatsapp)}
                                    >
                                      <MessageCircle className="w-5 h-5 mr-2" />
                                      Chat on WhatsApp
                                    </Button>
                                    
                                    <Button 
                                      variant="outline" 
                                      className="w-full border-2 border-blue-600 text-blue-700 hover:bg-blue-50 font-bold text-base py-6 shadow-md"
                                      onClick={() => selectedArtisan.provider.phone && window.open(`tel:${selectedArtisan.provider.phone}`)}
                                    >
                                      <Phone className="w-5 h-5 mr-2" />
                                      Call Now
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Send Message */}
                              <Card className="bg-white border-gray-200 shadow-lg">
                                <CardHeader className="bg-gray-50 border-b">
                                  <CardTitle className="text-blue-900 font-bold">Send a Message</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6 bg-white">
                                  <Textarea
                                    placeholder="Write your message here..."
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    className="min-h-[120px] border-blue-200 focus:border-blue-500"
                                  />
                                  <Button 
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={handleSendMessage}
                                    disabled={!chatMessage.trim()}
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                  </Button>
                                  <p className="text-sm text-gray-600 text-center">
                                    {selectedArtisan.provider.response_time}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-blue-600 font-semibold">Finding the best artisans for you...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <Card className="py-20 text-center bg-white border-2 border-dashed border-gray-300">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Services Found</h3>
                  <p className="text-gray-600">
                    We couldn&apos;t find any artisans matching your search criteria. Try adjusting your filters or check back later.
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}