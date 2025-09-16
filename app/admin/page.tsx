"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { getCurrentUser, getUsers, getServices, getBookings, saveUser, saveService } from "@/lib/storage"
import type { User, Service, Booking } from "@/lib/types"
import {
  Users,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  BarChart3,
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    // Simple admin check - in a real app, you'd have proper role management
    const isAdmin = user.email.includes("admin") || user.matricNumber === "00-00ad000"
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }

    setCurrentUser(user)
    setUsers(getUsers())
    setServices(getServices())
    setBookings(getBookings())
    setLoading(false)
  }, [router])

  const handleUserVerification = (userId: string, verified: boolean) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const updatedUser = { ...user, isVerified: verified, updatedAt: new Date().toISOString() }
        saveUser(updatedUser)
        return updatedUser
      }
      return user
    })
    setUsers(updatedUsers)
  }

  const handleServiceApproval = (serviceId: string, approved: boolean) => {
    const updatedServices = services.map((service) => {
      if (service.id === serviceId) {
        const updatedService = { ...service, isActive: approved, updatedAt: new Date().toISOString() }
        saveService(updatedService)
        return updatedService
      }
      return service
    })
    setServices(updatedServices)
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) return null

  const totalUsers = users.length
  const verifiedUsers = users.filter((u) => u.isVerified).length
  const activeServices = services.filter((s) => s.isActive).length
  const pendingServices = services.filter((s) => !s.isActive).length
  const totalBookings = bookings.length
  const completedBookings = bookings.filter((b) => b.status === "completed").length

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.matricNumber && user.matricNumber.toLowerCase().includes(searchQuery.toLowerCase()))

    if (selectedFilter === "all") return matchesSearch
    if (selectedFilter === "verified") return matchesSearch && user.isVerified
    if (selectedFilter === "unverified") return matchesSearch && !user.isVerified
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">TalentNest Admin Panel</h1>
            <p className="text-muted-foreground">Manage users, services, and platform operations</p>
          </div>
          <Button 
            onClick={() => router.push('/admin/verification')}
            className="flex items-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span>User Verification</span>
          </Button>
        </div>

        {/* Admin Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You are logged in as an administrator. Handle user data and platform operations responsibly.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                  <div className="text-xs text-green-600 mt-1">{verifiedUsers} verified</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{activeServices}</div>
                  <div className="text-sm text-muted-foreground">Active Services</div>
                  <div className="text-xs text-yellow-600 mt-1">{pendingServices} pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalBookings}</div>
                  <div className="text-sm text-muted-foreground">Total Bookings</div>
                  <div className="text-xs text-green-600 mt-1">{completedBookings} completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{getInitials(user.fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.fullName}</p>
                              <p className="text-xs text-muted-foreground">{user.faculty}</p>
                            </div>
                          </div>
                          <Badge variant={user.isVerified ? "default" : "secondary"}>
                            {user.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Recent Services</CardTitle>
                  <CardDescription>Latest service submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {services
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map((service) => (
                        <div key={service.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{service.title}</p>
                            <p className="text-xs text-muted-foreground">{service.category}</p>
                          </div>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold">User Management</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} />
                          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{user.fullName}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.matricNumber} • {user.faculty} • {user.level}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={user.isVerified ? "default" : "secondary"}>
                              {user.isVerified ? "Verified" : "Unverified"}
                            </Badge>
                            <Badge variant="outline">{user.skills.length} skills</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!user.isVerified ? (
                          <Button
                            size="sm"
                            onClick={() => handleUserVerification(user.id, true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserVerification(user.id, false)}
                            className="bg-transparent"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Unverify
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold">Service Management</h3>
              <div className="text-sm text-muted-foreground">
                {activeServices} active • {pendingServices} pending approval
              </div>
            </div>

            <div className="grid gap-4">
              {services.map((service) => {
                const serviceUser = users.find((u) => u.id === service.userId)
                return (
                  <Card key={service.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{service.title}</h4>
                            <Badge variant="secondary">{service.category}</Badge>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? "Active" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{service.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>By {serviceUser?.fullName || "Unknown User"}</span>
                            <span>{service.priceRange}</span>
                            <span>{service.viewsCount} views</span>
                            <span>{service.ordersCount} orders</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!service.isActive ? (
                            <Button
                              size="sm"
                              onClick={() => handleServiceApproval(service.id, true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleServiceApproval(service.id, false)}
                              className="bg-transparent"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Suspend
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold">Booking Management</h3>
              <div className="text-sm text-muted-foreground">{totalBookings} total bookings</div>
            </div>

            <div className="grid gap-4">
              {bookings
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((booking) => {
                  const client = users.find((u) => u.id === booking.clientId)
                  const provider = users.find((u) => u.id === booking.providerId)
                  const service = services.find((s) => s.id === booking.serviceId)
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{booking.title}</h4>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{booking.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Client: {client?.fullName || "Unknown"}</span>
                              <span>Provider: {provider?.fullName || "Unknown"}</span>
                              <span>Service: {service?.title || "Unknown"}</span>
                              {booking.agreedPrice && <span>Price: {booking.agreedPrice}</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Created {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold">Platform Analytics</h3>
              <Button size="sm" variant="outline" className="bg-transparent">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{totalUsers}</div>
                  <p className="text-sm text-muted-foreground">Total registered users</p>
                  <div className="mt-4">
                    <div className="text-sm text-green-600">↗ Growing steadily</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Service Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Digital</span>
                      <span className="text-sm font-medium">
                        {services.filter((s) => s.category === "digital").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Artisan</span>
                      <span className="text-sm font-medium">
                        {services.filter((s) => s.category === "artisan").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tutoring</span>
                      <span className="text-sm font-medium">
                        {services.filter((s) => s.category === "tutoring").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Booking Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Completed</span>
                      <span className="text-sm font-medium text-green-600">
                        {bookings.filter((b) => b.status === "completed").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">In Progress</span>
                      <span className="text-sm font-medium text-blue-600">
                        {bookings.filter((b) => b.status === "in_progress").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pending</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {bookings.filter((b) => b.status === "pending").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
