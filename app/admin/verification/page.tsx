"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  FileText,
  Eye,
  AlertCircle,
  Filter,
  Search
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface PendingArtisan {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string
  specialization: string
  experience: number
  location: string
  bio: string
  certificates: string[]
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

export default function ArtisanVerificationPage() {
  const [pendingArtisans, setPendingArtisans] = useState<PendingArtisan[]>([])
  const [selectedArtisan, setSelectedArtisan] = useState<PendingArtisan | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockArtisans: PendingArtisan[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        phone: "+234 812 345 6789",
        businessName: "John's Fashion Studio",
        specialization: "Fashion Design & Tailoring",
        experience: 3,
        location: "Kwara State",
        bio: "Experienced fashion designer with expertise in traditional and modern clothing. I have been working with various clients across the university community for over 3 years, specializing in both male and female outfits.",
        certificates: ["certificate1.pdf", "portfolio1.jpg", "portfolio2.jpg"],
        submittedAt: "2025-01-15T10:30:00Z",
        status: 'pending'
      },
      {
        id: "2", 
        firstName: "Mary",
        lastName: "Johnson",
        email: "mary.j@email.com",
        phone: "+234 803 456 7890",
        businessName: "Mary's Beauty Salon",
        specialization: "Hair Styling & Barbing",
        experience: 5,
        location: "Kwara State",
        bio: "Professional hair stylist and makeup artist with 5+ years of experience. I specialize in both traditional and contemporary hairstyles for all occasions.",
        certificates: ["certificate2.pdf", "work1.jpg"],
        submittedAt: "2025-01-14T14:20:00Z",
        status: 'pending'
      },
      {
        id: "3",
        firstName: "David",
        lastName: "Wilson", 
        email: "david.wilson@email.com",
        phone: "+234 807 123 4567",
        businessName: "Tech Solutions",
        specialization: "Web Development",
        experience: 4,
        location: "Lagos State",
        bio: "Full-stack web developer with expertise in modern web technologies. I help businesses and individuals create professional websites and web applications.",
        certificates: ["certificate3.pdf", "project1.jpg", "project2.jpg"],
        submittedAt: "2025-01-13T09:15:00Z",
        status: 'approved'
      }
    ]
    
    setPendingArtisans(mockArtisans)
    setIsLoading(false)
  }, [])

  const filteredArtisans = pendingArtisans.filter(artisan => {
    const matchesFilter = filter === 'all' || artisan.status === filter
    const matchesSearch = searchTerm === '' || 
      artisan.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const handleApprove = async (artisanId: string) => {
    // Mock API call - replace with actual implementation
    setPendingArtisans(prev => 
      prev.map(artisan => 
        artisan.id === artisanId 
          ? { ...artisan, status: 'approved' as const }
          : artisan
      )
    )
    setSelectedArtisan(null)
    // In real implementation, send approval email here
  }

  const handleReject = async (artisanId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    // Mock API call - replace with actual implementation
    setPendingArtisans(prev => 
      prev.map(artisan => 
        artisan.id === artisanId 
          ? { ...artisan, status: 'rejected' as const, rejectionReason }
          : artisan
      )
    )
    setSelectedArtisan(null)
    setRejectionReason("")
    // In real implementation, send rejection email with reason here
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
            <p>Loading artisan applications...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Image
              src="/images/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Artisan Verification Center
            </h1>
            <p className="text-muted-foreground">
              Review and verify artisan applications for the TalentNest platform
            </p>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, business, or specialization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Label htmlFor="filter">Status Filter</Label>
                  <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'approved' | 'rejected') => setFilter(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List of Applications */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Applications ({filteredArtisans.length})
              </h2>
              
              {filteredArtisans.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No applications found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredArtisans.map((artisan) => (
                  <Card 
                    key={artisan.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedArtisan?.id === artisan.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedArtisan(artisan)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{artisan.firstName} {artisan.lastName}</h3>
                            {getStatusBadge(artisan.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{artisan.businessName}</p>
                          <p className="text-sm text-blue-600">{artisan.specialization}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {artisan.location}
                            </span>
                            <span>{artisan.experience} years exp.</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Application Details</h2>
              
              {selectedArtisan ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedArtisan.firstName} {selectedArtisan.lastName}</CardTitle>
                        <CardDescription>{selectedArtisan.businessName}</CardDescription>
                      </div>
                      {getStatusBadge(selectedArtisan.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedArtisan.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedArtisan.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedArtisan.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">Business Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedArtisan.specialization}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedArtisan.experience} years of experience</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">Bio</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedArtisan.bio}
                      </p>
                    </div>

                    {/* Certificates */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">Certificates & Portfolio</h4>
                      <div className="space-y-2">
                        {selectedArtisan.certificates.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded border">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{cert}</span>
                            <Button variant="ghost" size="sm" className="ml-auto">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rejection Reason (if rejected) */}
                    {selectedArtisan.status === 'rejected' && selectedArtisan.rejectionReason && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-red-600">Rejection Reason</h4>
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">{selectedArtisan.rejectionReason}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {selectedArtisan.status === 'pending' && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                          <Textarea
                            id="rejectionReason"
                            placeholder="Provide a clear reason for rejection that will be sent to the applicant..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button 
                            onClick={() => handleApprove(selectedArtisan.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Application
                          </Button>
                          <Button 
                            onClick={() => handleReject(selectedArtisan.id)}
                            variant="destructive"
                            className="flex-1"
                            disabled={!rejectionReason.trim()}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Application
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Select an application to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}