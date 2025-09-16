"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { getCurrentUser, getServices, saveService, deleteService } from "@/lib/storage"
import type { User, Service } from "@/lib/types"
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Package
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Only allow artisans to access this page
    if (currentUser.accountType !== "artisan") {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)
    loadUserServices(currentUser.id)
    setLoading(false)
  }, [router])

  const loadUserServices = (userId: string) => {
    const allServices = getServices()
    const userServices = allServices.filter(service => service.userId === userId)
    setServices(userServices)
  }

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      deleteService(serviceId)
      if (user) {
        loadUserServices(user.id)
      }
    }
  }

  const handleToggleServiceStatus = (service: Service) => {
    const updatedService = {
      ...service,
      isActive: !service.isActive,
      updatedAt: new Date().toISOString()
    }
    saveService(updatedService)
    if (user) {
      loadUserServices(user.id)
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getTotalViews = () => {
    return services.reduce((total, service) => total + service.viewsCount, 0)
  }

  const getAverageRating = () => {
    const ratingsSum = services.reduce((sum, service) => sum + service.rating, 0)
    return services.length > 0 ? (ratingsSum / services.length).toFixed(1) : "0.0"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your services...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Services</h1>
            <p className="text-muted-foreground">
              Manage your service offerings and track their performance
            </p>
          </div>
          <Link href="/dashboard/services/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Service
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                  <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{getTotalViews()}</p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">{getAverageRating()}</p>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Status Alert */}
        {user.verificationStatus !== "verified" && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {user.verificationStatus === "pending" 
                ? "Your account is pending verification. Services will be visible to students once you're verified."
                : "Your account verification was rejected. Please contact admin or update your information."
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Services List */}
        {services.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first service to start connecting with students
              </p>
              <Link href="/dashboard/services/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Service
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="flex">
                  {/* Service Image */}
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={service.images[0] || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Service Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{service.title}</h3>
                          <Badge 
                            className={getStatusColor(service.isActive)}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">{service.category}</Badge>
                          {service.subcategory && (
                            <Badge variant="outline">{service.subcategory}</Badge>
                          )}
                          {service.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                          {service.tags.length > 2 && (
                            <Badge variant="secondary">+{service.tags.length - 2} more</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {service.viewsCount} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {service.rating.toFixed(1)} ({service.totalReviews} reviews)
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {service.deliveryTime}
                          </div>
                        </div>
                      </div>

                      {/* Action Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/services/${service.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Service
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/services/${service.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Service
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleServiceStatus(service)}
                          >
                            {service.isActive ? (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteService(service.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Service
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Service Stats Footer */}
                <div className="border-t bg-muted/50 px-6 py-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Price: <span className="font-medium">{service.priceRange}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Created: {new Date(service.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
