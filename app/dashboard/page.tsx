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
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push("/login")
        return
      }

      setUser(user)

      // Fetch user profile
      const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (profile) {
        setUserProfile(profile)
      }

      // Fetch user's services
      const { data: userServices } = await supabase
        .from("services")
        .select(`
          *,
          category:service_categories(name)
        `)
        .eq("provider_id", user.id)
        .eq("status", "active")

      if (userServices) {
        setServices(userServices)
      }

      // Fetch user's bookings
      const { data: userBookings } = await supabase
        .from("bookings")
        .select(`
          *,
          service:services(title)
        `)
        .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order("created_at", { ascending: false })

      if (userBookings) {
        setBookings(userBookings)
      }

      setLoading(false)
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Welcome back, {userProfile.full_name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">Manage your services, bookings, and profile on TalentNest</p>
        </div>

        {/* Profile Verification Alert */}
        {!userProfile.is_verified && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your profile is not yet verified. Complete your profile to increase trust with other students.
              <Link href="/dashboard/profile" className="ml-2 text-secondary hover:underline">
                Complete Profile →
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">{getInitials(userProfile.full_name)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-serif">{userProfile.full_name}</CardTitle>
                <CardDescription>
                  {userProfile.faculty} • {userProfile.level}
                </CardDescription>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {userProfile.total_rating.toFixed(1)} ({userProfile.total_reviews} reviews)
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{userProfile.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{userProfile.department}</span>
                  </div>
                </div>

                {userProfile.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {userProfile.skills.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {userProfile.skills.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{userProfile.skills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/dashboard/bookings">
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Manage Bookings
                    </Button>
                  </Link>
                  <Link href="/dashboard/services/new">
                    <Button className="w-full" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
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
                  <Card>
                    <CardContent className="p-4 text-center">
                      <ShoppingBag className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{services.length}</div>
                      <div className="text-xs text-muted-foreground">Services</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Eye className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Total Views</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{myBookingsAsClient.length}</div>
                      <div className="text-xs text-muted-foreground">My Bookings</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{myBookingsAsProvider.length}</div>
                      <div className="text-xs text-muted-foreground">Orders Received</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Recent Activity</CardTitle>
                    <CardDescription>Your latest bookings and service updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent activity</p>
                        <p className="text-sm">Start by browsing services or adding your own!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{booking.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.client_id === user.id ? "Your booking" : "Order received"}
                              </p>
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-semibold">My Services</h3>
                  <Link href="/dashboard/services/new">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </Link>
                </div>

                {services.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start showcasing your skills by adding your first service
                      </p>
                      <Link href="/dashboard/services/new">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Service
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <Card key={service.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{service.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{service.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />0 views
                                </span>
                                <span className="flex items-center gap-1">
                                  <ShoppingBag className="w-4 h-4" />0 orders
                                </span>
                                <Badge variant="secondary">{service.category?.name}</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-secondary">₦{service.price}</p>
                              <p className="text-xs text-muted-foreground">{service.delivery_time}</p>
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
                <h3 className="text-lg font-serif font-semibold">My Bookings</h3>

                {myBookingsAsClient.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground mb-4">Browse services and make your first booking</p>
                      <Link href="/marketplace">
                        <Button>Browse Services</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myBookingsAsClient.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold mb-1">{booking.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{booking.description}</p>
                              <p className="text-xs text-muted-foreground">
                                Created {new Date(booking.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.replace("_", " ")}
                              </Badge>
                              {booking.agreed_price && (
                                <p className="text-sm font-semibold mt-1">₦{booking.agreed_price}</p>
                              )}
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
                <h3 className="text-lg font-serif font-semibold">Orders Received</h3>

                {myBookingsAsProvider.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add services to start receiving orders from other students
                      </p>
                      <Link href="/dashboard/services/new">
                        <Button>Add a Service</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myBookingsAsProvider.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold mb-1">{booking.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{booking.description}</p>
                              <p className="text-xs text-muted-foreground">
                                Received {new Date(booking.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.replace("_", " ")}
                              </Badge>
                              {booking.agreed_price && (
                                <p className="text-sm font-semibold mt-1">₦{booking.agreed_price}</p>
                              )}
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
