"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  BookOpen, Calendar, Clock, Star, Heart,
  Search, DollarSign, User,
  CheckCircle, XCircle, AlertCircle, Eye,
  BookmarkPlus
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface StudentBooking {
  id: string
  service_id: string
  provider_id: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  booking_date: string
  delivery_date?: string
  total_amount: number
  special_requirements?: string
  created_at: string
  service: {
    id: string
    title: string
    category: string
    image_url?: string
    base_price: number
  }
  provider: {
    id: string
    full_name: string
    avatar_url?: string
    rating: number
    verified: boolean
  }
}

interface FavoriteService {
  id: string
  service_id: string
  created_at: string
  service: {
    id: string
    title: string
    category: string
    image_url?: string
    base_price: number
    provider: {
      id: string
      full_name: string
      avatar_url?: string
      rating: number
      verified: boolean
    }
  }
}

interface StudentReview {
  id: string
  service_id: string
  provider_id: string
  booking_id: string
  rating: number
  comment?: string
  created_at: string
  service: {
    title: string
    category: string
  }
  provider: {
    full_name: string
    avatar_url?: string
  }
}

interface RecommendedService {
  id: string
  title: string
  description: string
  category: string
  image_url?: string
  base_price: number
  rating: number
  reviews_count: number
  provider: {
    id: string
    full_name: string
    avatar_url?: string
    verified: boolean
    rating: number
  }
}

interface LearningSession {
  id: string
  provider_id: string
  title: string
  description: string
  category: string
  session_type: 'one-on-one' | 'group' | 'workshop'
  duration_hours: number
  price_per_hour: number
  max_participants?: number
  scheduled_at?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  provider: {
    full_name: string
    avatar_url?: string
    verified: boolean
    rating: number
  }
}

export default function StudentDashboardPage() {
  const { user } = useAuth()

  // Role-based routing
  if (user?.role === 'artisan') {
    window.location.href = '/providers/dashboard'
    return null
  }

  if (user?.role === 'admin') {
    window.location.href = '/admin/dashboard'
    return null
  }

  return (
    <AuthGuard allowedRoles={["student"]}>
      <StudentDashboardContent />
    </AuthGuard>
  )
}

function StudentDashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<StudentBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<FavoriteService[]>([])
  const [reviews, setReviews] = useState<StudentReview[]>([])
  const [recommendations, setRecommendations] = useState<RecommendedService[]>([])
  const [learningSessions, setLearningSessions] = useState<LearningSession[]>([])
  const [selectedBooking, setSelectedBooking] = useState<StudentBooking | null>(null)
  const [reviewDialog, setReviewDialog] = useState<{ open: boolean; booking?: StudentBooking }>({ open: false })
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      const mockBookings: StudentBooking[] = [
        {
          id: "1",
          service_id: "service1",
          provider_id: "provider1",
          status: "completed",
          booking_date: "2024-12-15T10:00:00Z",
          delivery_date: "2024-12-18T15:00:00Z",
          total_amount: 15000,
          special_requirements: "Need it before Monday",
          created_at: "2024-12-14T08:30:00Z",
          service: {
            id: "service1",
            title: "Professional Logo Design",
            category: "Graphic Design",
            image_url: "/placeholder.svg",
            base_price: 12000
          },
          provider: {
            id: "provider1",
            full_name: "Adebayo Oladele",
            avatar_url: "/placeholder-user.jpg",
            rating: 4.8,
            verified: true
          }
        },
        {
          id: "2",
          service_id: "service2",
          provider_id: "provider2",
          status: "in_progress",
          booking_date: "2024-12-18T14:00:00Z",
          total_amount: 25000,
          created_at: "2024-12-17T10:00:00Z",
          service: {
            id: "service2",
            title: "Traditional Agbada Tailoring",
            category: "Fashion Design",
            image_url: "/traditional-agbada.png",
            base_price: 25000
          },
          provider: {
            id: "provider2",
            full_name: "Fatima Ibrahim",
            avatar_url: "/placeholder-user.jpg",
            rating: 4.9,
            verified: true
          }
        }
      ]

      const mockFavorites: FavoriteService[] = [
        {
          id: "1",
          service_id: "service3",
          created_at: "2024-12-16T12:00:00Z",
          service: {
            id: "service3",
            title: "Website Development",
            category: "Web Development",
            image_url: "/placeholder.svg",
            base_price: 50000,
            provider: {
              id: "provider3",
              full_name: "John Okafor",
              avatar_url: "/placeholder-user.jpg",
              rating: 4.7,
              verified: true
            }
          }
        }
      ]

      const mockReviews: StudentReview[] = [
        {
          id: "1",
          service_id: "service1",
          provider_id: "provider1",
          booking_id: "1",
          rating: 5,
          comment: "Excellent work! Very professional and delivered on time.",
          created_at: "2024-12-18T16:00:00Z",
          service: {
            title: "Professional Logo Design",
            category: "Graphic Design"
          },
          provider: {
            full_name: "Adebayo Oladele",
            avatar_url: "/placeholder-user.jpg"
          }
        }
      ]

      const mockRecommendations: RecommendedService[] = [
        {
          id: "rec1",
          title: "Mobile App Development",
          description: "Custom mobile app development for iOS and Android",
          category: "Mobile Development",
          image_url: "/placeholder.svg",
          base_price: 80000,
          rating: 4.8,
          reviews_count: 24,
          provider: {
            id: "provider4",
            full_name: "Sarah Ahmed",
            avatar_url: "/placeholder-user.jpg",
            verified: true,
            rating: 4.8
          }
        },
        {
          id: "rec2",
          title: "Event Photography",
          description: "Professional event and portrait photography services",
          category: "Photography",
          image_url: "/placeholder.svg",
          base_price: 30000,
          rating: 4.6,
          reviews_count: 18,
          provider: {
            id: "provider5",
            full_name: "Michael Adebayo",
            avatar_url: "/placeholder-user.jpg",
            verified: true,
            rating: 4.6
          }
        }
      ]

      const mockLearningSessions: LearningSession[] = [
        {
          id: "learn1",
          provider_id: "provider1",
          title: "Introduction to Graphic Design",
          description: "Learn the basics of graphic design using professional tools",
          category: "Design",
          session_type: "one-on-one",
          duration_hours: 2,
          price_per_hour: 3000,
          scheduled_at: "2024-12-22T14:00:00Z",
          status: "scheduled",
          provider: {
            full_name: "Adebayo Oladele",
            avatar_url: "/placeholder-user.jpg",
            verified: true,
            rating: 4.8
          }
        }
      ]

      setBookings(mockBookings)
      setFavorites(mockFavorites)
      setReviews(mockReviews)
      setRecommendations(mockRecommendations)
      setLearningSessions(mockLearningSessions)
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId)
      setFavorites(updatedFavorites)
      toast({
        title: "Removed from Favorites",
        description: "Service has been removed from your favorites"
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive"
      })
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewDialog.booking) return

    try {
      const newReview: StudentReview = {
        id: Date.now().toString(),
        service_id: reviewDialog.booking.service_id,
        provider_id: reviewDialog.booking.provider_id,
        booking_id: reviewDialog.booking.id,
        rating: reviewRating,
        comment: reviewComment,
        created_at: new Date().toISOString(),
        service: reviewDialog.booking.service,
        provider: reviewDialog.booking.provider
      }

      setReviews([newReview, ...reviews])
      setReviewDialog({ open: false })
      setReviewRating(5)
      setReviewComment("")

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                {user.fullName?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.fullName || 'Student'}!
              </h1>
              <p className="text-gray-600">Discover amazing services from your fellow students</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Favorites</p>
                    <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reviews Given</p>
                    <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Learning Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{learningSessions.length}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="recommendations">For You</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Service Bookings ({bookings.length})</span>
                  <Link href="/services">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Services
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500 mb-4">Start booking services from talented students</p>
                    <Link href="/services">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Explore Services
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                              <Image
                                src={booking.service.image_url || '/placeholder.svg'}
                                alt={booking.service.title}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{booking.service.title}</h3>
                              <p className="text-sm text-gray-600">{booking.service.category}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={booking.provider.avatar_url} />
                                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                    {booking.provider.full_name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-700">{booking.provider.full_name}</span>
                                {booking.provider.verified && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Booked: {formatDate(booking.booking_date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">{booking.status.replace('_', ' ')}</span>
                              </Badge>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatPrice(booking.total_amount)}
                            </p>
                            <div className="flex space-x-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedBooking(booking)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {booking.status === 'completed' && !reviews.find(r => r.booking_id === booking.id) && (
                                <Button 
                                  size="sm" 
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                  onClick={() => setReviewDialog({ open: true, booking })}
                                >
                                  <Star className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {booking.special_requirements && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Special Requirements:</span> {booking.special_requirements}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Favorite Services ({favorites.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Favorites Yet</h3>
                    <p className="text-gray-500 mb-4">Save services you love for quick access</p>
                    <Link href="/services">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Explore Services
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
                          <Image
                            src={favorite.service.image_url || '/placeholder.svg'}
                            alt={favorite.service.title}
                            width={200}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{favorite.service.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{favorite.service.category}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={favorite.service.provider.avatar_url} />
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {favorite.service.provider.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700">{favorite.service.provider.full_name}</span>
                          {favorite.service.provider.verified && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-blue-600">
                            {formatPrice(favorite.service.base_price)}
                          </p>
                          <div className="flex space-x-2">
                            <Link href={`/services/${favorite.service.id}`}>
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRemoveFavorite(favorite.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Learning Sessions ({learningSessions.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {learningSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Learning Sessions</h3>
                    <p className="text-gray-500 mb-4">Book learning sessions with expert students</p>
                    <Link href="/services?category=learning">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Find Learning Sessions
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {learningSessions.map((session) => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {session.duration_hours}h
                              </span>
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {session.session_type}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {formatPrice(session.price_per_hour)}/hour
                              </span>
                            </div>
                            {session.scheduled_at && (
                              <p className="text-sm text-blue-600 mt-2">
                                Scheduled: {formatDate(session.scheduled_at)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={session.provider.avatar_url} />
                                <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                  {session.provider.full_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{session.provider.full_name}</p>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                  <span className="text-xs text-gray-600">{session.provider.rating}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>My Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500">Your reviews will appear here after completing services</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{review.service.title}</h3>
                            <p className="text-sm text-gray-600">{review.service.category}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={review.provider.avatar_url} />
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                  {review.provider.full_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-700">{review.provider.full_name}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={service.image_url || '/placeholder.svg'}
                          alt={service.title}
                          width={200}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={service.provider.avatar_url} />
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                            {service.provider.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">{service.provider.full_name}</span>
                        {service.provider.verified && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-700">{service.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({service.reviews_count})</span>
                        </div>
                        <p className="text-lg font-semibold text-blue-600">
                          {formatPrice(service.base_price)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/services/${service.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <BookmarkPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" defaultValue={user.fullName || ''} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email || ''} disabled />
                      </div>
                      <div>
                        <Label htmlFor="student-id">Student ID</Label>
                        <Input id="student-id" defaultValue={user.studentId || ''} />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" defaultValue={user.department || ''} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Booking Updates</Label>
                          <p className="text-sm text-gray-500">Get notified about booking status changes</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          defaultChecked 
                          aria-label="Enable booking updates notifications"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>New Services</Label>
                          <p className="text-sm text-gray-500">Get notified about new services in your favorite categories</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          defaultChecked 
                          aria-label="Enable new services notifications"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Learning Sessions</Label>
                          <p className="text-sm text-gray-500">Get notified about learning opportunities</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          defaultChecked 
                          aria-label="Enable learning sessions notifications"
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Booking Details Dialog */}
      <Dialog open={selectedBooking !== null} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={selectedBooking.service.image_url || '/placeholder.svg'}
                    alt={selectedBooking.service.title}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedBooking.service.title}</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.service.category}</p>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Provider</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedBooking.provider.avatar_url} />
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {selectedBooking.provider.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedBooking.provider.full_name}</span>
                  </div>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <p className="text-lg font-semibold text-blue-600 mt-1">
                    {formatPrice(selectedBooking.total_amount)}
                  </p>
                </div>
                <div>
                  <Label>Booking Date</Label>
                  <p className="text-sm text-gray-700 mt-1">{formatDate(selectedBooking.booking_date)}</p>
                </div>
                {selectedBooking.delivery_date && (
                  <div>
                    <Label>Delivery Date</Label>
                    <p className="text-sm text-gray-700 mt-1">{formatDate(selectedBooking.delivery_date)}</p>
                  </div>
                )}
              </div>
              
              {selectedBooking.special_requirements && (
                <div>
                  <Label>Special Requirements</Label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedBooking.special_requirements}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this service
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star 
                      className={`h-6 w-6 ${star <= reviewRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-comment">Comment (Optional)</Label>
              <Textarea
                id="review-comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setReviewDialog({ open: false })}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} className="bg-yellow-600 hover:bg-yellow-700">
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
