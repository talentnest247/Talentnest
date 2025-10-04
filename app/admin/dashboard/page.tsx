'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Shield
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Stats {
  totalUsers: number
  totalProviders: number
  pendingVerifications: number
  approvedProviders: number
  rejectedProviders: number
}

interface Provider {
  id: string
  business_name: string
  description: string
  specialization: string[]
  experience_years: number
  hourly_rate: number
  location: string
  skills_offered: string[]
  verification_status: string
  created_at: string
  user: {
    email: string
    full_name: string
    phone: string
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProviders: 0,
    pendingVerifications: 0,
    approvedProviders: 0,
    rejectedProviders: 0
  })
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([])
  const [approvedProviders, setApprovedProviders] = useState<Provider[]>([])
  const [rejectedProviders, setRejectedProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }

    if (user) {
      fetchData()
    }
  }, [user, router])

  const fetchData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      const providersRes = await fetch('/api/admin/users?type=provider')
      if (providersRes.ok) {
        const providersData = await providersRes.json()
        
        setPendingProviders(providersData.filter((p: Provider) => p.verification_status === 'pending'))
        setApprovedProviders(providersData.filter((p: Provider) => p.verification_status === 'approved'))
        setRejectedProviders(providersData.filter((p: Provider) => p.verification_status === 'rejected'))
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    }
  }

  const handleAction = async (providerId: string, action: 'approve' | 'reject', adminNotes?: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          providerId, 
          action,
          adminNotes: adminNotes || feedback || undefined
        })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: `Provider ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        })
        setFeedback('')
        setSelectedProvider(null)
        fetchData()
      } else {
        throw new Error('Action failed')
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${action} provider`,
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (providerId: string) => {
    if (!confirm('Are you sure you want to permanently delete this provider?')) {
      return
    }

    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/providers/${providerId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Provider deleted successfully",
        })
        fetchData()
      } else {
        throw new Error('Delete failed')
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete provider",
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const renderProviderCard = (provider: Provider, showActions: boolean = true) => (
    <Card key={provider.id} className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{provider.business_name}</CardTitle>
            <CardDescription>{provider.user.full_name}</CardDescription>
          </div>
          <Badge variant={
            provider.verification_status === 'approved' ? 'default' :
            provider.verification_status === 'rejected' ? 'destructive' : 'secondary'
          }>
            {provider.verification_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> {provider.user.email}</p>
          <p><strong>Phone:</strong> {provider.user.phone || 'Not provided'}</p>
          <p><strong>Location:</strong> {provider.location || 'Not specified'}</p>
          <p><strong>Experience:</strong> {provider.experience_years || 0} years</p>
          <p><strong>Rate:</strong> ₦{provider.hourly_rate || 0}/hour</p>
        </div>

        {provider.description && (
          <div>
            <strong className="text-sm">Description:</strong>
            <p className="text-sm text-muted-foreground mt-1">{provider.description}</p>
          </div>
        )}

        {provider.specialization && provider.specialization.length > 0 && (
          <div>
            <strong className="text-sm">Specializations:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {provider.specialization.map((spec, idx) => (
                <Badge key={idx} variant="outline">{spec}</Badge>
              ))}
            </div>
          </div>
        )}

        {provider.skills_offered && provider.skills_offered.length > 0 && (
          <div>
            <strong className="text-sm">Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {provider.skills_offered.map((skill, idx) => (
                <Badge key={idx} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Registered: {new Date(provider.created_at).toLocaleDateString()}
        </p>

        {showActions && (
          <div className="space-y-3 pt-4 border-t">
            {selectedProvider === provider.id ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Add feedback or notes (optional)..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedProvider(null)
                      setFeedback('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleAction(provider.id, 'approve', feedback)}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleAction(provider.id, 'reject', feedback)}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Confirm Reject
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {provider.verification_status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setSelectedProvider(provider.id)}
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(provider.id, 'approve')}
                      disabled={actionLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Quick Approve
                    </Button>
                  </>
                )}
                {provider.verification_status === 'rejected' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(provider.id, 'approve')}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}
                {provider.verification_status === 'approved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(provider.id, 'reject')}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Revoke
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(provider.id)}
                  disabled={actionLoading}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Manage artisan registrations and verifications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artisans</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProviders}</div>
            <p className="text-xs text-muted-foreground">All artisan accounts</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedProviders}</div>
            <p className="text-xs text-muted-foreground">Active artisans</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedProviders}</div>
            <p className="text-xs text-muted-foreground">Declined</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pending Review
            {pendingProviders.length > 0 && (
              <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0" variant="destructive">
                {pendingProviders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedProviders.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedProviders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingProviders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground text-center">
                  No pending artisan registrations to review
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p>{pendingProviders.length} artisan{pendingProviders.length !== 1 ? 's' : ''} waiting for review</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {pendingProviders.map(provider => renderProviderCard(provider))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedProviders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Approved Artisans</h3>
                <p className="text-muted-foreground">Approved artisans will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {approvedProviders.map(provider => renderProviderCard(provider))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedProviders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Rejected Artisans</h3>
                <p className="text-muted-foreground">Rejected artisans will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {rejectedProviders.map(provider => renderProviderCard(provider))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Button onClick={() => router.push('/marketplace')} variant="outline" size="lg">
          <TrendingUp className="w-5 h-5 mr-2" />
          View Marketplace
        </Button>
        <Button onClick={() => router.push('/admin/users')} variant="outline" size="lg">
          <Users className="w-5 h-5 mr-2" />
          Manage All Users
        </Button>
      </div>
    </main>
  )
}
