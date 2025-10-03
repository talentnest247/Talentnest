"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Users, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  GraduationCap, 
  Briefcase,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface User {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  full_name?: string
  role: string
  student_id?: string
  department?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at?: string
  userType: 'student' | 'artisan' | string
  verificationStatus?: string | null
  businessName?: string | null
  artisanData?: {
    business_name?: string
    verification_status?: string
    specialization?: string[]
  } | null
  studentData?: {
    year_of_study?: number
    interests?: string[]
  } | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [userTypeFilter, setUserTypeFilter] = useState<"all" | "student" | "artisan">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteReason, setDeleteReason] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const filterUsers = () => {
    let filtered = [...users]

    // Filter by user type
    if (userTypeFilter === "student") {
      filtered = filtered.filter(u => u.role === 'student')
    } else if (userTypeFilter === "artisan") {
      filtered = filtered.filter(u => u.role === 'provider')
    }

    // Filter by verification status (for artisans)
    if (statusFilter !== "all") {
      filtered = filtered.filter(u => u.verificationStatus === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(u => 
        u.full_name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.student_id?.toLowerCase().includes(term) ||
        u.businessName?.toLowerCase().includes(term)
      )
    }

    setFilteredUsers(filtered)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchTerm, userTypeFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const result = await response.json()
        setUsers(result.data || [])
      } else {
        console.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, reason: string) => {
    try {
      if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
        return
      }

      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          reason
        })
      })

      if (response.ok) {
        // Remove user from list
        setUsers(prev => prev.filter(u => u.id !== userId))
        setSelectedUser(null)
        setIsDeleting(false)
        setDeleteReason("")
        alert('User deleted successfully')
      } else {
        const error = await response.json()
        alert(`Failed to delete user: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user. Please try again.')
    }
  }

  const getStatusBadge = (status?: string | null) => {
    if (!status) return null
    
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    totalUsers: users.length,
    students: users.filter(u => u.role === 'student').length,
    artisans: users.filter(u => u.role === 'provider').length,
    verifiedArtisans: users.filter(u => u.role === 'provider' && u.verificationStatus === 'approved').length
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage all students and artisans on the platform</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-xs text-muted-foreground">All registered users</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
                <div className="text-xs text-muted-foreground">Registered students</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Artisans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.artisans}</div>
                <div className="text-xs text-muted-foreground">Service providers</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Verified Artisans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.verifiedArtisans}</div>
                <div className="text-xs text-muted-foreground">Active on platform</div>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                All Users
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, student ID, or business..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={userTypeFilter} onValueChange={(value: "all" | "student" | "artisan") => setUserTypeFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="User type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="artisan">Artisans</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value: "all" | "pending" | "approved" | "rejected") => setStatusFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found matching your criteria.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{user.full_name || 'Unknown User'}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {user.role === 'provider' ? (
                                <><Briefcase className="h-3 w-3 mr-1" />Artisan</>
                              ) : (
                                <><GraduationCap className="h-3 w-3 mr-1" />Student</>
                              )}
                            </Badge>
                            {user.student_id && (
                              <Badge variant="outline" className="text-xs">
                                {user.student_id}
                              </Badge>
                            )}
                            {user.businessName && (
                              <Badge variant="outline" className="text-xs">
                                {user.businessName}
                              </Badge>
                            )}
                            {user.verificationStatus && getStatusBadge(user.verificationStatus)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                            </DialogHeader>
                            
                            {selectedUser && (
                              <UserDetailView 
                                user={selectedUser}
                                onDelete={handleDeleteUser}
                                deleteReason={deleteReason}
                                setDeleteReason={setDeleteReason}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface UserDetailViewProps {
  user: User
  onDelete: (userId: string, reason: string) => void
  deleteReason: string
  setDeleteReason: (reason: string) => void
  isDeleting: boolean
  setIsDeleting: (isDeleting: boolean) => void
}

function UserDetailView({ user, onDelete, deleteReason, setDeleteReason, isDeleting, setIsDeleting }: UserDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="font-medium">{user.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="font-medium">{user.email || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <p className="font-medium capitalize">{user.role === 'provider' ? 'Artisan' : user.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            {user.student_id && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                <p className="font-medium">{user.student_id}</p>
              </div>
            )}
            {user.department && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <p className="font-medium">{user.department}</p>
              </div>
            )}
            {user.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Artisan Details */}
      {user.role === 'provider' && user.artisanData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Business Name</label>
              <p className="font-medium">{user.artisanData.business_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
              <div className="mt-1">
                {user.artisanData.verification_status === 'approved' && (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />Verified
                  </Badge>
                )}
                {user.artisanData.verification_status === 'pending' && (
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Clock className="h-3 w-3 mr-1" />Pending
                  </Badge>
                )}
                {user.artisanData.verification_status === 'rejected' && (
                  <Badge className="bg-red-50 text-red-700 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />Rejected
                  </Badge>
                )}
              </div>
            </div>
            {user.artisanData.specialization && user.artisanData.specialization.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Specializations</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.artisanData.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Section */}
      <div className="pt-4 border-t">
        {isDeleting ? (
          <div className="space-y-4 p-4 border-2 border-red-300 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 text-red-700 font-semibold">
              <AlertTriangle className="h-5 w-5" />
              <span>Permanently Delete User</span>
            </div>
            <p className="text-sm text-red-600">
              This will permanently delete {user.full_name} and all associated data including services, bookings, reviews, and messages. This action cannot be undone.
            </p>
            <Textarea
              placeholder="Please provide a reason for deletion (required)..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="min-h-[100px] border-red-300"
            />
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={() => onDelete(user.id, deleteReason)}
                disabled={!deleteReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Permanently Delete User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleting(false)
                  setDeleteReason("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setIsDeleting(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User Permanently
          </Button>
        )}
      </div>
    </div>
  )
}
