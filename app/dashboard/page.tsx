"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import {
  Settings,
  Plus,
  Star,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Search,
} from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  full_name: string
  matric_number: string
  faculty: string
  department: string
  level: string
  bio: string
  skills: string[]
  phone_number: string
  whatsapp_number: string
  total_rating: number
  total_reviews: number
  is_verified: boolean
  created_at: string
}

interface Service {
  id: string
  title: string
  description: string
  price: number
  price_type: string
  delivery_time: string
  status: string
  created_at: string
  category: {
    name: string
  }
}

interface Booking {
  id: string
  title: string
  description: string
  status: string
  agreed_price: number
  created_at: string
  client_id: string
  provider_id: string
  service: {
    title: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          console.error('Auth error:', authError)
          router.push("/login")
          return
        }

        if (!user) {
          router.push("/login")
          return
        }

        setUser(user)

        // Fetch user profile with retry logic
        try {
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()

          if (profileError) {
            console.warn('Profile fetch error:', profileError)
          } else if (profile) {
            setUserProfile(profile)
          }
        } catch (error) {
          console.warn('Failed to fetch profile:', error)
        }

        // Fetch user's services with error handling
        try {
          const { data: userServices, error: servicesError } = await supabase
            .from("services")
            .select(`
              *,
              category:service_categories(name)
            `)
            .eq("provider_id", user.id)
            .eq("status", "active")

          if (servicesError) {
            console.warn('Services fetch error:', servicesError)
          } else if (userServices) {
            setServices(userServices)
          }
        } catch (error) {
          console.warn('Failed to fetch services:', error)
        }

        // Fetch user's bookings with error handling
        try {
          const { data: userBookings, error: bookingsError } = await supabase
            .from("bookings")
            .select(`
              *,
              service:services(title)
            `)
            .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
            .order("created_at", { ascending: false })

          if (bookingsError) {
            console.warn('Bookings fetch error:', bookingsError)
          } else if (userBookings) {
            setBookings(userBookings)
          }
        } catch (error) {
          console.warn('Failed to fetch bookings:', error)
        }

      } catch (error) {
        console.error('Dashboard initialization error:', error)
        // Still allow dashboard to load even if there are connection issues
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const myBookingsAsClient = bookings.filter((b) => b.client_id === user.id)
  const myBookingsAsProvider = bookings.filter((b) => b.provider_id === user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Dashboard Active
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Welcome back, {userProfile.full_name.split(" ")[0]}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Manage your services, bookings, and profile on the UNILORIN TalentNest platform
          </p>
        </div>

        {/* Profile Verification Alert */}
        {!userProfile.is_verified && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Profile Not Verified:</strong> Complete your profile to increase trust with other students and unlock all features.
              <Link href="/dashboard/profile" className="ml-2 text-blue-600 hover:text-blue-700 font-semibold underline">
                Complete Profile →
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Enhanced Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="text-center pb-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-100">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-green-500 text-white">
                      {getInitials(userProfile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {userProfile.is_verified && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">{userProfile.full_name}</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  {userProfile.faculty} • Level {userProfile.level}
                </CardDescription>
                <div className="flex items-center justify-center gap-2 mt-3 bg-yellow-50 rounded-lg p-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {userProfile.total_rating.toFixed(1)} rating ({userProfile.total_reviews} reviews)
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">`
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">Contact Information</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>{userProfile.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span className="truncate">{userProfile.department}</span>
                  </div>
                </div>

                {userProfile.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-3">Your Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.slice(0, 8).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 border-0 text-xs px-2 py-1">
                          {skill}
                        </Badge>
                      ))}
                      {userProfile.skills.length > 8 && (
                        <Badge variant="outline" className="text-xs">
                          +{userProfile.skills.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <Link href="/dashboard/profile">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Dashboard Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">My Services</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-blue-700 mb-1">{services.length}</div>
                      <div className="text-sm text-blue-600 font-medium">Services</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-green-700 mb-1">0</div>
                      <div className="text-sm text-green-600 font-medium">Total Views</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-purple-700 mb-1">{myBookingsAsClient.length}</div>
                      <div className="text-sm text-purple-600 font-medium">My Bookings</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-orange-700 mb-1">{myBookingsAsProvider.length}</div>
                      <div className="text-sm text-orange-600 font-medium">Orders Received</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-lg">
                    <CardTitle className="font-serif text-gray-800 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-gray-600">Your latest bookings and service updates</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-10 h-10 text-blue-500" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">No recent activity</h4>
                        <p className="text-gray-500 mb-4">Start by browsing services or adding your own!</p>
                        <div className="flex gap-3 justify-center">
                          <Link href="/marketplace">
                            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                              Browse Services
                            </Button>
                          </Link>
                          <Link href="/dashboard/services/new">
                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                              Add Service
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{booking.title}</p>
                                <p className="text-sm text-gray-500">
                                  {booking.client_id === user.id ? "Your booking" : "Order received"}
                                </p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>{booking.status.replace("_", " ")}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                      My Services
                    </h3>
                    <p className="text-gray-600 mt-1">Manage and showcase your skills</p>
                  </div>
                  <Link href="/dashboard/services/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </Link>
                </div>

                {services.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No services yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Start showcasing your skills and talents by adding your first service. Let other students discover what you have to offer!
                      </p>
                      <Link href="/dashboard/services/new">
                        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3">
                          <Plus className="w-5 h-5 mr-2" />
                          Add Your First Service
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {services.map((service) => (
                      <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                  <ShoppingBag className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{service.title}</h4>
                                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 border-0">
                                    {service.category?.name}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{service.description}</p>
                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-blue-600">
                                  <Eye className="w-4 h-4" />
                                  <span className="font-medium">0 views</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-600">
                                  <ShoppingBag className="w-4 h-4" />
                                  <span className="font-medium">0 orders</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-3">
                                <p className="text-2xl font-bold text-gray-800">₦{service.price}</p>
                                <p className="text-sm text-gray-600">{service.delivery_time}</p>
                              </div>
                              <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                Edit Service
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-purple-600" />
                      My Bookings
                    </h3>
                    <p className="text-gray-600 mt-1">Track your service bookings and requests</p>
                  </div>
                  <Link href="/marketplace">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <Search className="w-4 h-4 mr-2" />
                      Browse Services
                    </Button>
                  </Link>
                </div>

                {myBookingsAsClient.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-12 h-12 text-purple-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No bookings yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Discover amazing services from talented students and make your first booking to get started!
                      </p>
                      <Link href="/marketplace">
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
                          <Search className="w-5 h-5 mr-2" />
                          Browse Services
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {myBookingsAsClient.map((booking) => (
                      <Card key={booking.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-lg mb-2">{booking.title}</h4>
                                <p className="text-gray-600 mb-3 leading-relaxed">{booking.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Created {new Date(booking.created_at).toLocaleDateString()}</span>
                                  </div>
                                  {booking.agreed_price && (
                                    <div className="flex items-center gap-1 text-green-600 font-medium">
                                      <span>₦{booking.agreed_price}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <Badge className={`${getStatusColor(booking.status)} px-3 py-1`}>
                                {booking.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-orange-600" />
                      Orders Received
                    </h3>
                    <p className="text-gray-600 mt-1">Manage incoming orders from other students</p>
                  </div>
                  <Link href="/dashboard/services/new">
                    <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </Link>
                </div>

                {myBookingsAsProvider.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-orange-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No orders yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Add services to start receiving orders from other students. Showcase your skills and talents!
                      </p>
                      <Link href="/dashboard/services/new">
                        <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3">
                          <Plus className="w-5 h-5 mr-2" />
                          Add a Service
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {myBookingsAsProvider.map((booking) => (
                      <Card key={booking.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-lg mb-2">{booking.title}</h4>
                                <p className="text-gray-600 mb-3 leading-relaxed">{booking.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Received {new Date(booking.created_at).toLocaleDateString()}</span>
                                  </div>
                                  {booking.agreed_price && (
                                    <div className="flex items-center gap-1 text-green-600 font-medium">
                                      <span>₦{booking.agreed_price}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <Badge className={`${getStatusColor(booking.status)} px-3 py-1`}>
                                {booking.status.replace("_", " ")}
                              </Badge>
                              <div className="mt-3">
                                <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                                  Manage Order
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
