"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { ArtisanVerificationList } from "@/components/admin/artisan-verification"
import { 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  Clock,
  TrendingUp,
  FileText
} from "lucide-react"

interface User {
  id: string
  email: string
  role: string
  full_name: string
  phone?: string
  is_verified: boolean
  is_active: boolean
  created_at: string
}

interface ArtisanProfile {
  id: string
  user_id: string
  matric_number: string
  business_name: string
  trade_category: string
  verification_status: string
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalArtisans: 0,
    pendingVerifications: 0,
    approvedArtisans: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const supabase = createClient()

  const loadData = useCallback(async () => {
    try {
      // Load all users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      // Load artisan profiles
      const { data: artisansData } = await supabase
        .from('artisan_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersData) {
        setUsers(usersData)
        
        // Calculate stats
        const totalUsers = usersData.length
        const totalStudents = usersData.filter(u => u.role === 'student').length
        const totalArtisans = usersData.filter(u => u.role === 'artisan').length
        
        setStats(prev => ({
          ...prev,
          totalUsers,
          totalStudents,
          totalArtisans
        }))
      }

      if (artisansData) {
        setArtisans(artisansData)
        
        const pendingVerifications = artisansData.filter(a => a.verification_status === 'pending').length
        const approvedArtisans = artisansData.filter(a => a.verification_status === 'approved').length
        
        setStats(prev => ({
          ...prev,
          pendingVerifications,
          approvedArtisans
        }))
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      setError("Failed to load admin data")
    }
  }, [supabase])

  const checkAdminAccess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      // Get user profile to check admin role
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error || !profile || profile.role !== 'admin') {
        setError("Access denied. Admin privileges required.")
        return
      }

      setCurrentUser(profile)
      await loadData()
    } catch (error) {
      console.error('Admin access check failed:', error)
      setError("Failed to verify admin access")
    } finally {
      setLoading(false)
    }
  }, [router, supabase, loadData])

  useEffect(() => {
    checkAdminAccess()
  }, [checkAdminAccess])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">TalentNest Admin Panel</h1>
                <p className="text-gray-600">Welcome, {currentUser?.full_name}</p>
              </div>
            </div>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Artisans</p>
                  <p className="text-2xl font-bold">{stats.totalArtisans}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">{stats.approvedArtisans}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verification">Artisan Verification</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="overview">System Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Artisan Verification Panel
                </CardTitle>
                <CardDescription>
                  Review and verify artisan applications with document validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArtisanVerificationList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage registered users on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-2">{user.full_name || 'N/A'}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">
                            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'artisan' ? 'secondary' : 'outline'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              {user.is_verified && (
                                <Badge variant="outline" className="text-green-600">
                                  Verified
                                </Badge>
                              )}
                              {user.is_active && (
                                <Badge variant="outline" className="text-blue-600">
                                  Active
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Artisan Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {artisans.slice(0, 5).map((artisan) => (
                      <div key={artisan.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{artisan.business_name}</p>
                          <p className="text-sm text-gray-600">{artisan.trade_category}</p>
                          <p className="text-xs text-gray-500">Matric: {artisan.matric_number}</p>
                        </div>
                        <Badge 
                          variant={
                            artisan.verification_status === 'approved' ? 'default' :
                            artisan.verification_status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {artisan.verification_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Registrations:</span>
                      <span className="font-semibold">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Student Accounts:</span>
                      <span className="font-semibold">{stats.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Artisan Accounts:</span>
                      <span className="font-semibold">{stats.totalArtisans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Verifications:</span>
                      <span className="font-semibold text-orange-600">{stats.pendingVerifications}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approved Artisans:</span>
                      <span className="font-semibold text-green-600">{stats.approvedArtisans}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
