"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { getCurrentUser, getBookings, getServices, getUsers, saveBooking } from "@/lib/storage"
import type { User, Booking, Service } from "@/lib/types"
import {
  ArrowLeft,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  UserIcon,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function BookingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    const allBookings = getBookings()
    const allServices = getServices()
    const allUsers = getUsers()

    // Get bookings where user is either client or provider
    const userBookings = allBookings.filter(
      (booking) => booking.clientId === currentUser.id || booking.providerId === currentUser.id,
    )

    // Populate booking data with service and user information
    const enrichedBookings = userBookings.map((booking) => ({
      ...booking,
      service: allServices.find((s) => s.id === booking.serviceId),
      client: allUsers.find((u) => u.id === booking.clientId),
      provider: allUsers.find((u) => u.id === booking.providerId),
    }))

    setUser(currentUser)
    setBookings(enrichedBookings)
    setServices(allServices)
    setUsers(allUsers)
    setLoading(false)
  }, [router])

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === bookingId) {
        const updatedBooking = { ...booking, status: newStatus as any, updatedAt: new Date().toISOString() }
        saveBooking(updatedBooking)
        return updatedBooking
      }
      return booking
    })
    setBookings(updatedBookings)
  }

  const initiateWhatsAppChat = (booking: Booking, targetUser: User) => {
    const message = `Hi! Regarding the booking: ${booking.title}. Let's discuss the details.`
    const whatsappUrl = `https://wa.me/${targetUser.whatsappNumber?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    // Mark WhatsApp chat as initiated
    const updatedBooking = { ...booking, whatsappChatInitiated: true, updatedAt: new Date().toISOString() }
    saveBooking(updatedBooking)
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? updatedBooking : b)))
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in_progress":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const myBookingsAsClient = bookings.filter((b) => b.clientId === user.id)
  const myBookingsAsProvider = bookings.filter((b) => b.providerId === user.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">My Bookings</h1>
            <p className="text-muted-foreground">Manage your service bookings and orders</p>
          </div>
        </div>

        <Tabs defaultValue="my-bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-bookings">My Bookings ({myBookingsAsClient.length})</TabsTrigger>
            <TabsTrigger value="received-orders">Orders Received ({myBookingsAsProvider.length})</TabsTrigger>
          </TabsList>

          {/* My Bookings Tab */}
          <TabsContent value="my-bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold">Services I've Booked</h3>
              <Link href="/marketplace">
                <Button size="sm">Browse More Services</Button>
              </Link>
            </div>

            {myBookingsAsClient.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">Browse the marketplace and book your first service</p>
                  <Link href="/marketplace">
                    <Button>Browse Services</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myBookingsAsClient.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{booking.title}</h4>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1">{booking.status.replace("_", " ")}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{booking.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {booking.agreedPrice && (
                          <div className="text-right">
                            <p className="font-semibold text-secondary">{booking.agreedPrice}</p>
                          </div>
                        )}
                      </div>

                      {/* Provider Info */}
                      {booking.provider && (
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={booking.provider.profileImageUrl || "/placeholder.svg"} />
                              <AvatarFallback>{getInitials(booking.provider.fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.provider.fullName}</p>
                              <p className="text-sm text-muted-foreground">Service Provider</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {booking.provider.whatsappNumber && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => initiateWhatsAppChat(booking, booking.provider!)}
                                className="bg-transparent"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp
                              </Button>
                            )}
                            {booking.service && (
                              <Link href={`/services/${booking.service.id}`}>
                                <Button size="sm" variant="outline" className="bg-transparent">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Service
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Received Tab */}
          <TabsContent value="received-orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold">Orders for My Services</h3>
              <Link href="/dashboard/services/new">
                <Button size="sm">Add New Service</Button>
              </Link>
            </div>

            {myBookingsAsProvider.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <UserIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add services to start receiving orders from other students
                  </p>
                  <Link href="/dashboard/services/new">
                    <Button>Add Your First Service</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myBookingsAsProvider.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{booking.title}</h4>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1">{booking.status.replace("_", " ")}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{booking.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Received on {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {booking.agreedPrice && <p className="font-semibold text-secondary">{booking.agreedPrice}</p>}
                          {booking.status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id, "accepted")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                                className="bg-transparent"
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                          {booking.status === "accepted" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(booking.id, "in_progress")}
                              className="mt-2"
                            >
                              Start Work
                            </Button>
                          )}
                          {booking.status === "in_progress" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(booking.id, "completed")}
                              className="mt-2 bg-green-600 hover:bg-green-700"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Client Info */}
                      {booking.client && (
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={booking.client.profileImageUrl || "/placeholder.svg"} />
                              <AvatarFallback>{getInitials(booking.client.fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.client.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.client.faculty} • {booking.client.level}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {booking.client.whatsappNumber && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => initiateWhatsAppChat(booking, booking.client!)}
                                className="bg-transparent"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Status Update Options */}
                      {booking.status !== "completed" && booking.status !== "cancelled" && (
                        <div className="mt-4 p-3 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Label className="text-sm font-medium">Update Status:</Label>
                            <Select
                              value={booking.status}
                              onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
