"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import {
  AlertCircle, Award, Bell, BookOpen, Briefcase, Calendar, Camera, CheckCircle, Clock,
  DollarSign, Download, Edit, Eye, FileText, Image as ImageIcon, Loader2, Mail,
  MessageSquare, Phone, Plus, Settings, Shield, Star, Trash2, Upload, User,
  Users, Video, XCircle, Zap, MapPin, TrendingUp, Heart, Share2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ProviderProfile {
  id: string
  user_id: string
  business_name: string
  description: string
  bio: string | null
  specialization: string[]
  experience: number
  location: string
  rating: number
  total_reviews: number
  verified: boolean
  verification_status: 'pending' | 'approved' | 'rejected'
  whatsapp_number: string | null
  availability_available_for_work: boolean
  availability_available_for_learning: boolean
  pricing_base_rate: number | null
  pricing_learning_rate: number | null
  pricing_currency: string
  created_at: string
}

interface PortfolioItem {
  id: string
  provider_id: string
  title: string
  description: string
  image_url: string
  type: 'image' | 'video' | 'document'
  created_at: string
}

interface Booking {
  id: string
  student_name: string
  student_email: string
  student_avatar?: string
  service: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  amount: number
  created_at: string
  due_date?: string
}

interface Message {
  id: string
  from_user_id: string
  from_name: string
  from_avatar?: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

interface Analytics {
  total_views: number
  total_contacts: number
  total_bookings: number
  completed_jobs: number
  total_earnings: number
  response_rate: number
}

export default function ProviderDashboardEnhanced() {
  return (
    <AuthGuard allowedRoles={["artisan"]}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <ProviderDashboardContent />
        <Footer />
      </div>
    </AuthGuard>
  )
}

function ProviderDashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [profile, setProfile] = useState<ProviderProfile | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({
    total_views: 0,
    total_contacts: 0,
    total_bookings: 0,
    completed_jobs: 0,
    total_earnings: 0,
    response_rate: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadDialog, setUploadDialog] = useState(false)
  const [editProfileDialog, setEditProfileDialog] = useState(false)
  
  // Form states
  const [portfolioTitle, setPortfolioTitle] = useState("")
  const [portfolioDescription, setPortfolioDescription] = useState("")
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProviderData()
  }, [])

  const fetchProviderData = async () => {
    try {
      setLoading(true)
      
      // Fetch provider profile
      const profileRes = await fetch('/api/providers/me')
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData.profile)
        setAnalytics(profileData.analytics || analytics)
      }

      // Fetch portfolio
      const portfolioRes = await fetch('/api/providers/portfolio')
      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json()
        setPortfolio(portfolioData.items || [])
      }

      // Fetch bookings
      const bookingsRes = await fetch('/api/bookings/provider')
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData.bookings || [])
      }

      // Fetch messages
      const messagesRes = await fetch('/api/messages')
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json()
        setMessages(messagesData.messages || [])
      }
    } catch (error) {
      console.error('Error fetching provider data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async (type: 'work' | 'learning') => {
    try {
      const field = type === 'work' ? 'availability_available_for_work' : 'availability_available_for_learning'
      const newValue = !profile?.[field]
      
      const res = await fetch('/api/providers/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue })
      })

      if (res.ok) {
        setProfile(prev => prev ? { ...prev, [field]: newValue } : null)
        toast({
          title: "Success",
          description: `${type === 'work' ? 'Work' : 'Learning'} availability updated`
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      })
    }
  }

  const handlePortfolioUpload = async () => {
    if (!portfolioFile || !portfolioTitle) {
      toast({
        title: "Error",
        description: "Please provide title and file",
        variant: "destructive"
      })
      return
    }

    try {
      setUploading(true)
      
      // Upload file
      const formData = new FormData()
      formData.append('file', portfolioFile)
      formData.append('title', portfolioTitle)
      formData.append('description', portfolioDescription)

      const res = await fetch('/api/providers/portfolio', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setPortfolio(prev => [data.item, ...prev])
        setUploadDialog(false)
        setPortfolioTitle("")
        setPortfolioDescription("")
        setPortfolioFile(null)
        toast({
          title: "Success!",
          description: "Portfolio item uploaded successfully"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload portfolio item",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePortfolioItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return

    try {
      const res = await fetch(`/api/providers/portfolio/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setPortfolio(prev => prev.filter(item => item.id !== id))
        toast({
          title: "Deleted",
          description: "Portfolio item removed"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-gray-600 mb-4">Please complete your provider registration</p>
        <Button onClick={() => router.push('/register')}>Complete Registration</Button>
      </div>
    )
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const unreadMessages = messages.filter(m => !m.read)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={user?.avatar_url} alt={profile.business_name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl">
                {profile.business_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold">{profile.business_name}</h1>
                {profile.verified && (
                  <Badge className="bg-blue-600 hover:bg-blue-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{user?.full_name || user?.email}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{profile.rating.toFixed(1)}</span>
                  <span>({profile.total_reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={() => setEditProfileDialog(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Verification Status Alert */}
        {profile.verification_status === 'pending' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">Verification Pending</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Your application is under review. You'll be notified once approved. While waiting, you can set up your profile and portfolio.
              </p>
            </div>
          </div>
        )}

        {profile.verification_status === 'rejected' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Verification Rejected</h3>
              <p className="text-sm text-red-700 mt-1">
                Your application was not approved. Please contact support for more information.
              </p>
            </div>
          </div>
        )}

        {profile.verification_status === 'approved' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">You're Live! 🎉</h3>
              <p className="text-sm text-green-700 mt-1">
                Your profile is approved and visible to students on the marketplace.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{analytics.total_views}</p>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{analytics.total_bookings}</p>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">{pendingBookings.length} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{analytics.completed_jobs}</p>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round((analytics.completed_jobs / Math.max(analytics.total_bookings, 1)) * 100)}% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{profile.pricing_currency} {analytics.total_earnings.toLocaleString()}</p>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Briefcase className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="portfolio">
            <ImageIcon className="w-4 h-4 mr-2" />
            Portfolio ({portfolio.length})
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <Calendar className="w-4 h-4 mr-2" />
            Bookings ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages ({unreadMessages.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Bookings
                    <Badge variant="outline">{bookings.length} total</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No bookings yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Avatar>
                            <AvatarImage src={booking.student_avatar} />
                            <AvatarFallback>{booking.student_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{booking.student_name}</p>
                                <p className="text-sm text-gray-600">{booking.service}</p>
                              </div>
                              <Badge
                                className={
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                  booking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{profile.pricing_currency} {booking.amount.toLocaleString()}</span>
                              <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Portfolio Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Portfolio
                    <Button onClick={() => setActiveTab('portfolio')} variant="outline" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio.length === 0 ? (
                    <div className="text-center py-8">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600 mb-4">No portfolio items yet</p>
                      <Button onClick={() => setUploadDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Work
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {portfolio.slice(0, 6).map((item) => (
                        <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Availability Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Available for Work</p>
                      <p className="text-sm text-gray-600">Accept new bookings</p>
                    </div>
                    <Switch
                      checked={profile.availability_available_for_work}
                      onCheckedChange={() => handleToggleAvailability('work')}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-medium">Available for Learning</p>
                      <p className="text-sm text-gray-600">Offer training sessions</p>
                    </div>
                    <Switch
                      checked={profile.availability_available_for_learning}
                      onCheckedChange={() => handleToggleAvailability('learning')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="font-semibold">{analytics.response_rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all" 
                        style={{ width: `${analytics.response_rate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-semibold">
                        {Math.round((analytics.completed_jobs / Math.max(analytics.total_bookings, 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.round((analytics.completed_jobs / Math.max(analytics.total_bookings, 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Unread Messages */}
              {unreadMessages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Unread Messages
                      <Badge variant="destructive">{unreadMessages.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {unreadMessages.slice(0, 3).map((msg) => (
                        <div key={msg.id} className="p-2 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium">{msg.from_name}</p>
                          <p className="text-xs text-gray-600 truncate">{msg.subject}</p>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-3" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('messages')}
                    >
                      View All Messages
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">My Portfolio</h2>
              <p className="text-gray-600">Showcase your best work</p>
            </div>
            <Button onClick={() => setUploadDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Work
            </Button>
          </div>

          {portfolio.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Portfolio Items</h3>
                <p className="text-gray-600 mb-6">Start building your portfolio by uploading your work</p>
                <Button onClick={() => setUploadDialog(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="aspect-video bg-gray-100 relative">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeletePortfolioItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bookings & Orders</h2>
            <p className="text-gray-600">Manage your student bookings</p>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                <p className="text-gray-600">Students will contact you when they need your services</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.student_avatar} />
                          <AvatarFallback>{booking.student_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.student_name}</h3>
                          <p className="text-gray-600">{booking.student_email}</p>
                          <p className="text-sm text-gray-500 mt-1">{booking.service}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium text-green-600">
                              {profile.pricing_currency} {booking.amount.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                            {booking.due_date && (
                              <span className="text-sm text-gray-500">
                                Due: {new Date(booking.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Messages</h2>
            <p className="text-gray-600">Communicate with students</p>
          </div>

          {messages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Messages</h3>
                <p className="text-gray-600">You'll see messages from students here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Message List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">All Messages</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!msg.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={msg.from_avatar} />
                            <AvatarFallback>{msg.from_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">{msg.from_name}</p>
                              {!msg.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Message Content */}
              <Card className="lg:col-span-2">
                <CardContent className="text-center py-16">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Select a message to view</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Settings</h2>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your business details visible to students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Name</Label>
                  <Input value={profile.business_name} readOnly />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={profile.location} readOnly />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea value={profile.bio || ''} rows={3} readOnly />
              </div>
              <div>
                <Label>Skills/Specialization</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.specialization.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <Button onClick={() => setEditProfileDialog(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set your rates for services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Base Rate</Label>
                  <Input 
                    type="number" 
                    value={profile.pricing_base_rate || ''} 
                    placeholder="Enter base rate"
                    readOnly
                  />
                </div>
                <div>
                  <Label>Learning Rate</Label>
                  <Input 
                    type="number" 
                    value={profile.pricing_learning_rate || ''} 
                    placeholder="Enter learning rate"
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How students can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>WhatsApp Number</Label>
                <Input value={profile.whatsapp_number || ''} readOnly />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.email || ''} readOnly />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Portfolio Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Portfolio Item</DialogTitle>
            <DialogDescription>
              Add work samples to showcase your skills
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input 
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                placeholder="e.g., Wedding Dress Design"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                value={portfolioDescription}
                onChange={(e) => setPortfolioDescription(e.target.value)}
                placeholder="Describe this work..."
                rows={3}
              />
            </div>
            <div>
              <Label>Image/File *</Label>
              <Input 
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePortfolioUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
