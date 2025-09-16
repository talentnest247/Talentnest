"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getServices, getUsers, getCurrentUser, saveBooking, generateId, getCurrentTimestamp } from "@/lib/storage"
import type { Service, User, Booking } from "@/lib/types"
import {
  ArrowLeft,
  Star,
  Eye,
  Clock,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [provider, setProvider] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    const serviceId = params.id as string
    const allServices = getServices()
    const allUsers = getUsers()
    const user = getCurrentUser()

    const foundService = allServices.find((s) => s.id === serviceId)
    if (foundService) {
      setService(foundService)
      const serviceProvider = allUsers.find((u) => u.id === foundService.userId)
      setProvider(serviceProvider || null)

      // Increment view count (in a real app, this would be done server-side)
      const updatedService = { ...foundService, viewsCount: foundService.viewsCount + 1 }
      // saveService(updatedService) // Uncomment if you want to track views
    }

    setCurrentUser(user)
    setLoading(false)
  }, [params.id])

  const handleBookService = async () => {
    if (!service || !provider || !currentUser) return

    setIsBooking(true)

    try {
      const newBooking: Booking = {
        id: generateId(),
        serviceId: service.id,
        clientId: currentUser.id,
        providerId: provider.id,
        title: `Booking: ${service.title}`,
        description: `Service booking from ${currentUser.fullName}`,
        status: "pending",
        whatsappChatInitiated: false,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      }

      saveBooking(newBooking)
      setBookingSuccess(true)

      // Auto-redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/${provider.whatsappNumber?.replace(/[^0-9]/g, "")}?text=Hi! I'm interested in your service: ${service.title}`
        window.open(whatsappUrl, "_blank")
      }, 2000)
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsBooking(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service...</p>
        </div>
      </div>
    )
  }

  if (!service || !provider) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Service not found</h3>
              <p className="text-muted-foreground mb-4">
                The service you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/marketplace">
                <Button>Browse Other Services</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const isOwnService = currentUser?.id === provider.id

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
        </div>

        {/* Success Alert */}
        {bookingSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <MessageCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Booking request sent! You'll be redirected to WhatsApp to chat with {provider.fullName}.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Images */}
            {service.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={service.images[0] || "/placeholder.svg?height=400&width=600"}
                    alt={service.title}
                    className="w-full h-64 md:h-80 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Service Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-serif mb-2">{service.title}</CardTitle>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary">{service.category}</Badge>
                      {service.subcategory && <Badge variant="outline">{service.subcategory}</Badge>}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{service.viewsCount} views</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{service.ordersCount} orders</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">{service.priceRange}</p>
                    <p className="text-sm text-muted-foreground">{service.deliveryTime}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>

                  {service.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Service Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={provider.profileImageUrl || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(provider.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{provider.fullName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {provider.faculty} • {provider.level}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {provider.rating.toFixed(1)} ({provider.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {provider.bio && (
                  <div>
                    <h5 className="font-medium mb-1">About</h5>
                    <p className="text-sm text-muted-foreground">{provider.bio}</p>
                  </div>
                )}

                {provider.skills.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {provider.skills.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {provider.skills.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.skills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {provider.portfolioLinks.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Portfolio</h5>
                    <div className="space-y-1">
                      {provider.portfolioLinks.slice(0, 3).map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-secondary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate">{link}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card>
              <CardContent className="p-6">
                {!currentUser ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Please sign in to book this service</AlertDescription>
                    </Alert>
                    <Link href="/login">
                      <Button className="w-full">Sign In to Book</Button>
                    </Link>
                  </div>
                ) : isOwnService ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>This is your own service</AlertDescription>
                    </Alert>
                    <Link href="/dashboard/services">
                      <Button variant="outline" className="w-full bg-transparent">
                        Manage Service
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={handleBookService}
                      disabled={isBooking || bookingSuccess}
                      className="w-full"
                      size="lg"
                    >
                      {isBooking ? "Booking..." : bookingSuccess ? "Booked!" : "Book This Service"}
                    </Button>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Contact Provider</h4>

                      {provider.whatsappNumber && (
                        <WhatsAppButton
                          phoneNumber={provider.whatsappNumber}
                          message={`Hi ${provider.fullName}! I'm interested in your service: "${service.title}". Can we discuss the details?`}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          Contact via WhatsApp
                        </WhatsAppButton>
                      )}

                      {provider.phoneNumber && (
                        <a
                          href={`tel:${provider.phoneNumber}`}
                          className="flex items-center gap-2 text-sm text-secondary hover:underline"
                        >
                          <Phone className="w-4 h-4" />
                          {provider.phoneNumber}
                        </a>
                      )}

                      <a
                        href={`mailto:${provider.email}?subject=Inquiry about: ${service.title}`}
                        className="flex items-center gap-2 text-sm text-secondary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Delivery: {service.deliveryTime}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
