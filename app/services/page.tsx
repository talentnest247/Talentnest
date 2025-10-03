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
  Search, Star, MapPin, Phone, Heart, MessageCircle, Send, Shield, Mail
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
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Discover Talented <span className="text-blue-600">Artisans</span>
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Connect with skilled student artisans in the UNILORIN community. Find quality services with transparent reviews and easy communication.
          </p>
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
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48 border-blue-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 overflow-hidden">
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.images?.[0] || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 border-white/20 hover:bg-white"
                    onClick={() => toggleFavorite(service.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favoriteServices.includes(service.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-blue-600 text-white">
                    {service.category.name}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Provider Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-blue-200">
                      <AvatarImage src={service.provider.avatar_url} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {service.provider.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {service.provider.verification_status === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      service.provider.availability_status === 'online' ? 'bg-green-500' :
                      service.provider.availability_status === 'busy' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-blue-900 truncate">{service.provider.full_name}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(service.provider.rating_average)}
                        <span className="ml-1 text-sm text-gray-600">
                          {service.provider.rating_average} ({service.provider.total_reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {service.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ₦{service.base_price?.toLocaleString()}
                    </span>
                    {service.price_type === 'hourly' && (
                      <span className="text-sm text-gray-500">/hour</span>
                    )}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedArtisan(service)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-blue-900">
                          {selectedArtisan?.title}
                        </DialogTitle>
                      </DialogHeader>

                      {selectedArtisan && (
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 bg-blue-50">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                              Overview
                            </TabsTrigger>
                            <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                              Portfolio
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                              Reviews ({selectedArtisan.provider.total_reviews})
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                              Contact
                            </TabsTrigger>
                          </TabsList>

                          {/* Overview Tab */}
                          <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Artisan Profile */}
                              <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                                  <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                      <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                                        <AvatarImage src={selectedArtisan.provider.avatar_url} />
                                        <AvatarFallback className="bg-blue-600 text-white text-xl">
                                          {selectedArtisan.provider.full_name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <h3 className="text-xl font-bold text-blue-900 mb-1">
                                          {selectedArtisan.provider.full_name}
                                        </h3>
                                        <p className="text-blue-700 mb-2">{selectedArtisan.category.name} Specialist</p>
                                        <div className="flex items-center space-x-4 text-sm text-blue-600">
                                          <div className="flex items-center">
                                            {renderStars(selectedArtisan.provider.rating_average)}
                                            <span className="ml-1">{selectedArtisan.provider.rating_average}</span>
                                          </div>
                                          <span>•</span>
                                          <span>{selectedArtisan.provider.completed_projects} projects completed</span>
                                          <span>•</span>
                                          <span>{selectedArtisan.provider.experience_years} years experience</span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-blue-900">About This Service</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-700 mb-4">{selectedArtisan.description}</p>
                                    <p className="text-gray-700">{selectedArtisan.provider.bio}</p>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-blue-900">Skills & Expertise</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedArtisan.provider.skills?.map((skill, index) => (
                                        <Badge key={index} className="bg-blue-100 text-blue-800">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Sidebar */}
                              <div className="space-y-6">
                                <Card className="bg-white border-blue-200">
                                  <CardHeader>
                                    <CardTitle className="text-blue-900">Service Details</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Starting Price:</span>
                                      <span className="font-bold text-blue-600">
                                        ₦{selectedArtisan.base_price?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Delivery Time:</span>
                                      <span className="font-medium">{selectedArtisan.delivery_time} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Response Time:</span>
                                      <span className="font-medium text-green-600">
                                        {selectedArtisan.provider.response_time}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Location:</span>
                                      <span className="font-medium">
                                        {selectedArtisan.provider.location_on_campus}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-green-50 border-green-200">
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                                        selectedArtisan.provider.availability_status === 'online' ? 'bg-green-500' :
                                        selectedArtisan.provider.availability_status === 'busy' ? 'bg-yellow-500' :
                                        'bg-gray-400'
                                      }`} />
                                      <p className="font-medium text-green-800">
                                        {selectedArtisan.provider.availability_status === 'online' ? 'Online Now' :
                                         selectedArtisan.provider.availability_status === 'busy' ? 'Busy' :
                                         'Offline'}
                                      </p>
                                      <p className="text-sm text-green-600">
                                        {selectedArtisan.provider.response_time}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Portfolio Tab */}
                          <TabsContent value="portfolio" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {selectedArtisan.images?.map((image, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                  <Image
                                    src={image}
                                    alt={`Portfolio ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          {/* Reviews Tab */}
                          <TabsContent value="reviews" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-6 text-center">
                                  <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {selectedArtisan.provider.rating_average}
                                  </div>
                                  <div className="flex justify-center mb-2">
                                    {renderStars(selectedArtisan.provider.rating_average)}
                                  </div>
                                  <p className="text-blue-700">Average Rating</p>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-6 text-center">
                                  <div className="text-3xl font-bold text-green-600 mb-2">
                                    {selectedArtisan.provider.total_reviews}
                                  </div>
                                  <p className="text-green-700">Total Reviews</p>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-purple-50 border-purple-200">
                                <CardContent className="p-6 text-center">
                                  <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {selectedArtisan.provider.completed_projects}
                                  </div>
                                  <p className="text-purple-700">Projects Completed</p>
                                </CardContent>
                              </Card>
                            </div>

                            <div className="space-y-4">
                              {selectedArtisan.reviews?.map((review) => (
                                <Card key={review.id} className="border-blue-100">
                                  <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={review.user_avatar} />
                                        <AvatarFallback className="bg-blue-100 text-blue-700">
                                          {review.user_name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                          <h4 className="font-medium text-blue-900">{review.user_name}</h4>
                                          <span className="text-sm text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="flex items-center mb-2">
                                          {renderStars(review.rating)}
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                        {review.images && (
                                          <div className="flex space-x-2 mt-3">
                                            {review.images.map((img, idx) => (
                                              <div key={idx} className="w-16 h-16 relative rounded overflow-hidden">
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
                          <TabsContent value="contact" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Contact Information */}
                              <Card className="bg-blue-50 border-blue-200">
                                <CardHeader>
                                  <CardTitle className="text-blue-900">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-blue-900">Email</p>
                                      <p className="text-blue-700">{selectedArtisan.provider.email}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-blue-900">Phone</p>
                                      <p className="text-blue-700">{selectedArtisan.provider.phone}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-blue-900">Campus Location</p>
                                      <p className="text-blue-700">{selectedArtisan.provider.location_on_campus}</p>
                                    </div>
                                  </div>

                                  <div className="pt-4 space-y-3">
                                    <Button 
                                      className="w-full bg-green-600 hover:bg-green-700"
                                      onClick={() => selectedArtisan.provider.whatsapp && openWhatsApp(selectedArtisan.provider.whatsapp)}
                                    >
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      Chat on WhatsApp
                                    </Button>
                                    
                                    <Button 
                                      variant="outline" 
                                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                                      onClick={() => selectedArtisan.provider.phone && window.open(`tel:${selectedArtisan.provider.phone}`)}
                                    >
                                      <Phone className="w-4 h-4 mr-2" />
                                      Call Now
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Send Message */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-blue-900">Send a Message</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
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

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-blue-600">Loading services...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}