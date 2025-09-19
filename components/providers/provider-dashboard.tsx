"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Edit, 
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Phone
} from "lucide-react"
import { ProviderProfileForm } from "./provider-profile-form"
import { useAuth } from "@/contexts/auth-context"
import type { Provider, ContactRequest, VerificationRequest } from "@/lib/types"

export function ProviderDashboard() {
  const { user } = useAuth()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null)
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    if (!user) return

    // Simulate API calls
    setTimeout(() => {
      // Mock provider data
      const mockProvider: Provider = {
        id: "provider-1",
        email: user.email,
        password: "", // Not displayed in dashboard
        firstName: user.firstName || "John",
        lastName: user.lastName || "Doe",
        fullName: user.fullName,
        role: "artisan",
        businessName: "Custom Tailoring Services",
        description: "Professional tailoring and fashion design services specializing in traditional and modern Nigerian attire.",
        specialization: ["Fashion Design", "Tailoring", "Traditional Wear"],
        location: "Ilorin, Kwara State",
        experience: 3,
        rating: 4.8,
        totalReviews: 24,
        phone: "+234 803 123 4567",
        whatsappNumber: "+234 803 123 4567",
        verified: true,
        skills: [], // Empty for now
        availability: {
          isAvailable: true,
          availableForWork: true,
          availableForLearning: true,
          responseTime: "Usually responds within 2 hours"
        },
        pricing: {
          baseRate: 15000,
          learningRate: 8000,
          currency: "NGN"
        },
        verificationStatus: "approved",
        verificationEvidence: [],
        portfolio: [],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20")
      }

      // Mock contact requests
      const mockContactRequests: ContactRequest[] = [
        {
          id: "contact-1",
          studentId: "student-1",
          providerId: "provider-1",
          serviceType: "direct_service",
          contactMethod: "whatsapp",
          messagePreview: "Hi, I'm interested in getting a traditional agbada made for my graduation ceremony.",
          contactedAt: new Date("2024-01-22T10:30:00Z"),
          responseReceived: true,
          responseTimeHours: 1,
          bookingCompleted: true,
          rating: 5
        },
        {
          id: "contact-2",
          studentId: "student-2",
          providerId: "provider-1",
          serviceType: "skill_learning",
          contactMethod: "whatsapp",
          messagePreview: "Hello! I'd like to learn basic tailoring techniques. Do you offer beginner classes?",
          contactedAt: new Date("2024-01-21T14:15:00Z"),
          responseReceived: true,
          responseTimeHours: 3,
          bookingCompleted: false
        }
      ]

      setProvider(mockProvider)
      setContactRequests(mockContactRequests)
      setIsLoading(false)
    }, 1000)
  }, [user])

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Verified Provider</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Verification Denied</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">No Provider Profile Found</h2>
        <p className="text-muted-foreground mb-6">Create your provider profile to start offering services on the platform.</p>
        <Button onClick={() => setIsEditing(true)}>Create Provider Profile</Button>
        
        {isEditing && (
          <div className="mt-8">
            <ProviderProfileForm 
              onSubmit={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            {getVerificationStatusBadge(provider.verificationStatus)}
            <div className="text-xs text-muted-foreground mt-2">
              {provider.verificationStatus === "approved" && "Your profile is verified and visible to students"}
              {provider.verificationStatus === "pending" && "We're reviewing your verification documents"}
              {provider.verificationStatus === "rejected" && "Please resubmit with additional documentation"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{provider.rating}</div>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-xs text-muted-foreground">Based on {provider.totalReviews} reviews</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contact Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactRequests.length}</div>
            <div className="text-xs text-muted-foreground">This month</div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Status Alert */}
      {provider.verificationStatus === "pending" && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your verification is in progress. You'll receive an email once it's reviewed. Meanwhile, you can update your profile information.
          </AlertDescription>
        </Alert>
      )}

      {provider.verificationStatus === "rejected" && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Your verification was not approved. Please check the admin notes and resubmit with additional documentation.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="contacts">Contact Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Business Information
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{provider.businessName}</h3>
                <p className="text-muted-foreground">{provider.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Specializations</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {provider.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Base Service Rate</label>
                  <p className="font-medium">₦{provider.pricing.baseRate?.toLocaleString() || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Learning Rate</label>
                  <p className="font-medium">₦{provider.pricing.learningRate?.toLocaleString() || 'Not set'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">WhatsApp Number</label>
                <p className="font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {provider.whatsappNumber}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <ProviderProfileForm 
            provider={provider}
            onSubmit={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Recent Contact Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contactRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No contact requests yet. Your profile will start receiving inquiries once verified.
                </div>
              ) : (
                <div className="space-y-4">
                  {contactRequests.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {contact.serviceType === 'direct_service' ? 'Service Request' : 'Learning Inquiry'}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {new Date(contact.contactedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className="text-sm">{contact.messagePreview}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {contact.responseReceived && (
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Responded in {contact.responseTimeHours}h
                          </span>
                        )}
                        {contact.bookingCompleted && (
                          <span className="flex items-center text-blue-600">
                            <Users className="h-3 w-3 mr-1" />
                            Booking completed
                          </span>
                        )}
                        {contact.rating && (
                          <span className="flex items-center text-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            {contact.rating}/5 rating
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Response Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Average Response Time</label>
                    <p className="text-2xl font-bold">2.5 hours</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Response Rate</label>
                    <p className="text-2xl font-bold">100%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Booking Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Conversion Rate</label>
                    <p className="text-2xl font-bold">50%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completed Bookings</label>
                    <p className="text-2xl font-bold">{contactRequests.filter(c => c.bookingCompleted).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      {isEditing && !provider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProviderProfileForm 
              provider={provider}
              onSubmit={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
