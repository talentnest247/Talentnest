'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  UserCheck, 
  GraduationCap,
  Search,
  Mail,
  Phone,
  Calendar,
  Shield,
  ArrowLeft,
  Trash2
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  full_name: string
  first_name: string
  last_name: string
  role: string
  phone: string
  avatar_url: string
  bio: string
  created_at: string
  userType: string
  verificationStatus?: string
  businessName?: string
  artisanData?: {
    business_name: string
    description: string
    specialization: string[]
    experience_years: number
    hourly_rate: number
    location: string
    verification_status: string
  }
  studentData?: {
    student_id: string
    department: string
    level: number
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'student' | 'provider' | 'admin'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchUsers()
  }, [user, router])

  const filterUsers = () => {
    let filtered = users

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(u => u.role === filterType)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(u =>
        u.full_name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.businessName?.toLowerCase().includes(query) ||
        u.studentData?.student_id?.toLowerCase().includes(query)
      )
    }

    setFilteredUsers(filtered)
  }

  useEffect(() => {
    filterUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterType, users])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users?type=all')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.data || [])
        setFilteredUsers(data.data || [])
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
      } else {
        throw new Error('Delete failed')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'provider': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'student': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'provider': return <UserCheck className="w-4 h-4" />
      case 'student': return <GraduationCap className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    providers: users.filter(u => u.role === 'provider').length,
    admins: users.filter(u => u.role === 'admin').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">User Management</h1>
        </div>
        <p className="text-muted-foreground">View and manage all platform users</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.students}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artisans</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.providers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or business..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filterType === 'student' ? 'default' : 'outline'}
                onClick={() => setFilterType('student')}
                size="sm"
              >
                Students ({stats.students})
              </Button>
              <Button
                variant={filterType === 'provider' ? 'default' : 'outline'}
                onClick={() => setFilterType('provider')}
                size="sm"
              >
                Artisans ({stats.providers})
              </Button>
              <Button
                variant={filterType === 'admin' ? 'default' : 'outline'}
                onClick={() => setFilterType('admin')}
                size="sm"
              >
                Admins ({stats.admins})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map(user => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{user.full_name || 'Unnamed User'}</CardTitle>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </Badge>
                      {user.role === 'provider' && user.verificationStatus && (
                        <Badge variant={
                          user.verificationStatus === 'approved' ? 'default' :
                          user.verificationStatus === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {user.verificationStatus}
                        </Badge>
                      )}
                    </div>
                    {user.businessName && (
                      <CardDescription className="font-medium">
                        Business: {user.businessName}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {user.artisanData && (
                    <div className="space-y-2">
                      <p><strong>Experience:</strong> {user.artisanData.experience_years || 0} years</p>
                      <p><strong>Rate:</strong> ₦{user.artisanData.hourly_rate || 0}/hour</p>
                      <p><strong>Location:</strong> {user.artisanData.location || 'Not specified'}</p>
                      {user.artisanData.specialization && user.artisanData.specialization.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {user.artisanData.specialization.map((spec, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{spec}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {user.studentData && (
                    <div className="space-y-2">
                      <p><strong>Student ID:</strong> {user.studentData.student_id}</p>
                      <p><strong>Department:</strong> {user.studentData.department}</p>
                      <p><strong>Level:</strong> {user.studentData.level}</p>
                    </div>
                  )}
                </div>

                {user.bio && (
                  <div>
                    <strong className="text-sm">Bio:</strong>
                    <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteUser(user.id, user.full_name)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination info */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </main>
  )
}
