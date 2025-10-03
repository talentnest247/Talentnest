"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { VerificationDashboard } from "@/components/admin/verification-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users, Shield, AlertTriangle,
  Activity, UserCheck, Calendar, Flag
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface VerificationRequest {
  id: string
  user_id: string
  user: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    role: string
    department?: string
    student_id?: string
  }
  portfolio_images?: string[]
  certifications?: string[]
  skills_offered?: string[]
  submitted_at: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
}

interface UserReport {
  id: string
  reporter_id: string
  reported_user_id: string
  reason: string
  description: string
  evidence?: string[]
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  created_at: string
  reporter: {
    id: string
    full_name: string
    email: string
  }
  reported_user: {
    id: string
    full_name: string
    email: string
    role: string
  }
}

interface AdminAnalytics {
  total_users: number
  total_providers: number
  total_seekers: number
  total_services: number
  total_bookings: number
  pending_verifications: number
  active_reports: number
  verified_providers: number
  monthly_growth: {
    users: number
    bookings: number
    revenue: number
  }
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </AuthGuard>
  )
}

function AdminDashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [userReports, setUserReports] = useState<UserReport[]>([])
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    total_users: 0,
    total_providers: 0,
    total_seekers: 0,
    total_services: 0,
    total_bookings: 0,
    pending_verifications: 0,
    active_reports: 0,
    verified_providers: 0,
    monthly_growth: {
      users: 0,
      bookings: 0,
      revenue: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null)
  const [verificationAction, setVerificationAction] = useState<'approve' | 'reject' | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  const fetchVerificationRequests = useCallback(async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockRequests: VerificationRequest[] = [
        {
          id: "1",
          user_id: "user1",
          user: {
            id: "user1",
            full_name: "Adebayo Oladele",
            email: "adebayo@student.unilorin.edu.ng",
            avatar_url: "/placeholder-user.jpg",
            role: "artisan",
            department: "Computer Science",
            student_id: "17/55CS123"
          },
          portfolio_images: ["/placeholder.svg", "/placeholder.svg"],
          certifications: ["Adobe Certified Expert"],
          skills_offered: ["Graphic Design", "Logo Design", "Branding"],
          submitted_at: "2024-12-18T10:30:00Z",
          status: "pending"
        },
        {
          id: "2",
          user_id: "user2",
          user: {
            id: "user2",
            full_name: "Fatima Ibrahim",
            email: "fatima@student.unilorin.edu.ng",
            role: "artisan",
            department: "Fine Arts",
            student_id: "18/55FA456"
          },
          portfolio_images: ["/traditional-agbada.png"],
          skills_offered: ["Traditional Tailoring", "Fashion Design"],
          submitted_at: "2024-12-17T14:15:00Z",
          status: "pending"
        }
      ]
      setVerificationRequests(mockRequests)
    } catch {
      console.error('Error fetching verification requests')
    }
  }, [])

  const fetchUserReports = useCallback(async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockReports: UserReport[] = [
        {
          id: "1",
          reporter_id: "user3",
          reported_user_id: "user4",
          reason: "Poor Service Quality",
          description: "Provider did not deliver work as promised and was unresponsive to messages.",
          status: "open",
          created_at: "2024-12-18T09:00:00Z",
          reporter: {
            id: "user3",
            full_name: "John Doe",
            email: "john@student.unilorin.edu.ng"
          },
          reported_user: {
            id: "user4",
            full_name: "Jane Smith",
            email: "jane@student.unilorin.edu.ng",
            role: "artisan"
          }
        }
      ]
      setUserReports(mockReports)
    } catch {
      console.error('Error fetching user reports')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      // Mock data for now - replace with actual API call
      setAnalytics({
        total_users: 1250,
        total_providers: 320,
        total_seekers: 930,
        total_services: 450,
        total_bookings: 1820,
        pending_verifications: verificationRequests.filter(r => r.status === 'pending').length,
        active_reports: userReports.filter(r => r.status === 'open').length,
        verified_providers: 280,
        monthly_growth: {
          users: 15.2,
          bookings: 23.5,
          revenue: 18.7
        }
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }, [verificationRequests, userReports])

  useEffect(() => {
    fetchVerificationRequests()
    fetchUserReports()
    fetchAnalytics()
  }, [fetchVerificationRequests, fetchUserReports, fetchAnalytics])

  const handleVerificationAction = async (requestId: string, action: 'approve' | 'reject', notes: string) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Verification action:', { requestId, action, notes })
      
      const updatedRequests = verificationRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: (action === 'approve' ? 'approved' : 'rejected') as 'pending' | 'approved' | 'rejected', admin_notes: notes }
          : req
      )
      setVerificationRequests(updatedRequests)

      toast({
        title: action === 'approve' ? "Provider Verified" : "Verification Rejected",
        description: `The verification request has been ${action === 'approve' ? 'approved' : 'rejected'}.`
      })

      setSelectedVerification(null)
      setVerificationAction(null)
      setAdminNotes("")
    } catch {
      toast({
        title: "Error",
        description: "Failed to process verification request",
        variant: "destructive"
      })
    }
  }

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Report action:', { reportId, action })
      
      const updatedReports = userReports.map(report => 
        report.id === reportId 
          ? { ...report, status: (action === 'resolve' ? 'resolved' : 'closed') as 'open' | 'investigating' | 'resolved' | 'closed' }
          : report
      )
      setUserReports(updatedReports)

      toast({
        title: action === 'resolve' ? "Report Resolved" : "Report Dismissed",
        description: `The report has been ${action === 'resolve' ? 'resolved' : 'dismissed'}.`
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to process report",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'open': return 'bg-red-100 text-red-800'
      case 'investigating': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">UniLorin TalentNest Administration Panel</p>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.total_users}</p>
                  <p className="text-xs text-green-600">+{analytics.monthly_growth.users}% this month</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Providers</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.total_providers}</p>
                  <p className="text-xs text-blue-600">{analytics.verified_providers} verified</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.total_bookings}</p>
                  <p className="text-xs text-green-600">+{analytics.monthly_growth.bookings}% this month</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.pending_verifications + analytics.active_reports}</p>
                  <p className="text-xs text-orange-600">{analytics.pending_verifications} verifications, {analytics.active_reports} reports</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="verifications" className="relative">
              Verifications
              {analytics.pending_verifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                  {analytics.pending_verifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reports" className="relative">
              Reports
              {analytics.active_reports > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                  {analytics.active_reports}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <VerificationDashboard admin={{ 
              id: user?.id || '', 
              email: user?.email || '',
              password: '',
              firstName: user?.fullName?.split(' ')[0] || '',
              lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
              fullName: user?.fullName || '',
              phone: '',
              role: 'admin',
              permissions: [],
              createdAt: new Date(),
              updatedAt: new Date()
            }} />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Reports ({userReports.length})</span>
                  <Badge className="bg-red-100 text-red-800">
                    {userReports.filter(r => r.status === 'open').length} Open
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {userReports.length === 0 ? (
                  <div className="text-center py-12">
                    <Flag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports</h3>
                    <p className="text-gray-500">No user reports to review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{report.reason}</h3>
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                            <div className="text-xs text-gray-500">
                              <p>Reported by: {report.reporter.full_name} ({report.reporter.email})</p>
                              <p>Against: {report.reported_user.full_name} ({report.reported_user.email})</p>
                              <p>Submitted: {formatDate(report.created_at)}</p>
                            </div>
                          </div>
                          {report.status === 'open' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleReportAction(report.id, 'resolve')}
                              >
                                Resolve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleReportAction(report.id, 'dismiss')}
                              >
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <Link href="/admin/users">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Users className="h-4 w-4 mr-2" />
                        Manage All Users
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 border border-gray-200 rounded-lg">
                      <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Total Users</h3>
                      <p className="text-3xl font-bold text-gray-900">{analytics.total_users}</p>
                    </div>
                    <div className="text-center p-6 border border-gray-200 rounded-lg">
                      <UserCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Verified Providers</h3>
                      <p className="text-3xl font-bold text-gray-900">{analytics.verified_providers}</p>
                    </div>
                    <div className="text-center p-6 border border-gray-200 rounded-lg">
                      <Activity className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Active Services</h3>
                      <p className="text-3xl font-bold text-gray-900">{analytics.total_services}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Quick Actions</h4>
                    <p className="text-sm text-blue-700 mb-3">Manage all students and artisans, including viewing details and deleting users.</p>
                    <Link href="/admin/users">
                      <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        Go to User Management →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">User Growth</span>
                    <span className="text-sm text-green-600">+{analytics.monthly_growth.users}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Booking Growth</span>
                    <span className="text-sm text-green-600">+{analytics.monthly_growth.bookings}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Revenue Growth</span>
                    <span className="text-sm text-green-600">+{analytics.monthly_growth.revenue}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Users</span>
                    <span className="text-sm text-gray-900">{Math.round(analytics.total_users * 0.68)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">System Uptime</span>
                    <span className="text-sm text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-green-600">120ms</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-approve-students">Auto-approve verified students</Label>
                          <p className="text-sm text-gray-500">Automatically verify students with valid IDs</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          id="auto-approve-students"
                          title="Auto-approve verified students"
                          aria-label="Auto-approve verified students"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="require-portfolio">Require portfolio for verification</Label>
                          <p className="text-sm text-gray-500">Mandate portfolio submission for providers</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          id="require-portfolio"
                          title="Require portfolio for verification"
                          defaultChecked 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Limits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="max-services">Max services per provider</Label>
                        <Input id="max-services" type="number" defaultValue="10" />
                      </div>
                      <div>
                        <Label htmlFor="max-images">Max portfolio images</Label>
                        <Input id="max-images" type="number" defaultValue="15" />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Verification Action Dialog */}
      <Dialog open={verificationAction !== null} onOpenChange={() => setVerificationAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationAction === 'approve' ? 'Approve Verification' : 'Reject Verification'}
            </DialogTitle>
            <DialogDescription>
              {verificationAction === 'approve' 
                ? 'This will grant the provider a verified badge and allow them to appear in verified searches.'
                : 'Please provide a reason for rejecting this verification request.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={verificationAction === 'approve' ? 'Optional notes...' : 'Reason for rejection...'}
                required={verificationAction === 'reject'}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setVerificationAction(null)}>
                Cancel
              </Button>
              <Button
                className={verificationAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                onClick={() => {
                  if (selectedVerification && verificationAction) {
                    handleVerificationAction(selectedVerification.id, verificationAction, adminNotes)
                  }
                }}
              >
                {verificationAction === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}