"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus, Edit, Trash2, Eye, Star,
  Calendar, CheckCircle, MessageSquare,
  Award, Zap
} from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface ProviderService {
  id: string
  title: string
  description: string
  price_type: 'fixed' | 'hourly' | 'negotiable'
  base_price?: number
  max_price?: number
  delivery_time?: number
  images?: string[]
  tags?: string[]
  is_active: boolean
  created_at: string
  category: {
    id: string
    name: string
  }
}

interface Booking {
  id: string
  title: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  budget?: number
  created_at: string
  seeker: {
    id: string
    full_name: string
    avatar_url?: string
  }
  service: {
    id: string
    title: string
  }
}

interface Analytics {
  total_services: number
  active_bookings: number
  completed_bookings: number
  total_earnings: number
  average_rating: number
  profile_views: number
  response_rate: number
  completion_rate: number
}

export default function ProviderDashboardPage() {
  return (
    <AuthGuard allowedRoles={["artisan"]}>
      <ProviderDashboardContent />
    </AuthGuard>
  )
}

function ProviderDashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [services, setServices] = useState<ProviderService[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({
    total_services: 0,
    active_bookings: 0,
    completed_bookings: 0,
    total_earnings: 0,
    average_rating: 0,
    profile_views: 0,
    response_rate: 0,
    completion_rate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [availableForLearning, setAvailableForLearning] = useState(false)
  const [availabilityStatus, setAvailabilityStatus] = useState('offline')
  const [showCreateService, setShowCreateService] = useState(false)

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      if (data.success) {
        setServices(data.data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }, [])

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch('/api/bookings?role=provider')
      const data = await response.json()
      if (data.success) {
        setBookings(data.data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      // This would fetch real analytics from the API
      // For now, we'll calculate from existing data
      setAnalytics({
        total_services: services.length,
        active_bookings: bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status)).length,
        completed_bookings: bookings.filter(b => b.status === 'completed').length,
        total_earnings: 0, // Would be calculated from completed transactions
        average_rating: user?.rating || 0,
        profile_views: 0, // Would come from analytics API
        response_rate: 95, // Mock data
        completion_rate: 98 // Mock data
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }, [services.length, bookings, user?.rating])

  useEffect(() => {
    if (user) {
      fetchServices()
      fetchBookings()
      fetchAnalytics()
      setAvailableForLearning(user.available_for_learning || false)
      setAvailabilityStatus(user.availability_status || 'offline')
    }
  }, [user, fetchServices, fetchBookings, fetchAnalytics])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const updateAvailability = async (status: string) => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability_status: status })
      })

      if (response.ok) {
        setAvailabilityStatus(status)
        toast({
          title: "Status Updated",
          description: `Your availability is now ${status}`
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update availability status",
        variant: "destructive"
      })
    }
  }

  const toggleLearningAvailability = async (available: boolean) => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available_for_learning: available })
      })

      if (response.ok) {
        setAvailableForLearning(available)
        toast({
          title: "Learning Availability Updated",
          description: available ? "You're now available for teaching" : "You're no longer available for teaching"
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update learning availability",
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

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'away': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl">
                  {user.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.fullName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(availabilityStatus)}`}></div>
                  <span className="text-sm text-gray-500 capitalize">{availabilityStatus}</span>
                  {user.verification_status === 'verified' && (
                    <Badge className="bg-blue-100 text-blue-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Select value={availabilityStatus} onValueChange={updateAvailability}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">🟢 Online</SelectItem>
                  <SelectItem value="busy">🟡 Busy</SelectItem>
                  <SelectItem value="away">🟠 Away</SelectItem>
                  <SelectItem value="offline">⚫ Offline</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => setShowCreateService(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>

          {/* Learning Toggle */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Available for Learning</h3>
                    <p className="text-sm text-gray-600">Allow students to book learning sessions with you</p>
                  </div>
                </div>
                <Switch
                  checked={availableForLearning}
                  onCheckedChange={toggleLearningAvailability}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.total_services}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.active_bookings}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.completed_bookings}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-3xl font-bold text-gray-900">{analytics.average_rating}</p>
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Services ({services.length})</span>
                  <Button
                    onClick={() => setShowCreateService(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Yet</h3>
                    <p className="text-gray-500 mb-4">Start by creating your first service offering</p>
                    <Button
                      onClick={() => setShowCreateService(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{service.title}</h3>
                              <Badge className={service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {service.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">{service.category.name}</Badge>
                            </div>
                            <p className="text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>
                                {service.base_price ? formatPrice(service.base_price) : 'Negotiable'}
                              </span>
                              {service.delivery_time && (
                                <span>{service.delivery_time} days delivery</span>
                              )}
                              <span>Created {formatTimeAgo(service.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
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

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Recent Bookings ({bookings.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500">Your booking requests will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={booking.seeker.avatar_url} />
                              <AvatarFallback>{booking.seeker.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{booking.title}</h3>
                              <p className="text-sm text-gray-600">from {booking.seeker.full_name}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status.replace('_', ' ')}
                                </Badge>
                                {booking.budget && (
                                  <span className="text-sm text-gray-500">Budget: {formatPrice(booking.budget)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{formatTimeAgo(booking.created_at)}</p>
                            <div className="flex space-x-2 mt-2">
                              {booking.status === 'pending' && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    Accept
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Decline
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Response Rate</span>
                      <span>{analytics.response_rate}%</span>
                    </div>
                    <Progress value={analytics.response_rate} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span>{analytics.completion_rate}%</span>
                    </div>
                    <Progress value={analytics.completion_rate} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Profile Views</span>
                      <span>{analytics.profile_views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      {formatPrice(analytics.total_earnings)}
                    </p>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location">Campus Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Engineering Faculty"
                        defaultValue={user.location_on_campus}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourly-rate">Hourly Rate (for learning sessions)</Label>
                      <Input
                        id="hourly-rate"
                        type="number"
                        placeholder="e.g., 2000"
                        defaultValue={user.hourly_rate}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="skills">Skills Offered</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., Graphic Design, Photography, Web Development"
                      defaultValue={user.skills_offered?.join(', ')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="specializations">Specializations</Label>
                    <Textarea
                      id="specializations"
                      placeholder="Describe your areas of expertise..."
                      defaultValue={user.specializations?.join(', ')}
                    />
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Create Service Dialog */}
      <Dialog open={showCreateService} onOpenChange={setShowCreateService}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Service</DialogTitle>
            <DialogDescription>
              Add a new service to your portfolio and start receiving bookings.
            </DialogDescription>
          </DialogHeader>
          <CreateServiceForm onSuccess={() => {
            setShowCreateService(false)
            fetchServices()
          }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Create Service Form Component
function CreateServiceForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price_type: 'fixed' as 'fixed' | 'hourly' | 'negotiable',
    base_price: '',
    max_price: '',
    delivery_time: '',
    tags: '',
    requirements: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const serviceData = {
        ...formData,
        base_price: formData.base_price ? Number(formData.base_price) : undefined,
        max_price: formData.max_price ? Number(formData.max_price) : undefined,
        delivery_time: formData.delivery_time ? Number(formData.delivery_time) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Service Created",
          description: "Your service has been successfully created and is now live."
        })
        onSuccess()
      } else {
        throw new Error(data.error || 'Failed to create service')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create service",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Service Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Professional Logo Design"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your service in detail..."
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital">Digital Services</SelectItem>
              <SelectItem value="artisan">Artisan Services</SelectItem>
              <SelectItem value="academic">Academic Support</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price_type">Pricing Type *</Label>
          <Select value={formData.price_type} onValueChange={(value: 'fixed' | 'hourly' | 'negotiable') => setFormData({ ...formData, price_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Price</SelectItem>
              <SelectItem value="hourly">Hourly Rate</SelectItem>
              <SelectItem value="negotiable">Negotiable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="base_price">Base Price (₦)</Label>
          <Input
            id="base_price"
            type="number"
            value={formData.base_price}
            onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
            placeholder="e.g., 15000"
          />
        </div>

        <div>
          <Label htmlFor="delivery_time">Delivery Time (days)</Label>
          <Input
            id="delivery_time"
            type="number"
            value={formData.delivery_time}
            onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
            placeholder="e.g., 3"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., logo, branding, design"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? 'Creating...' : 'Create Service'}
        </Button>
      </div>
    </form>
  )
}
