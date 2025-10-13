'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Shield,
  Loader2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Trash2
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalProviders: number
  pendingVerifications: number
  approvedProviders: number
  rejectedProviders: number
}

interface Provider {
  id: string
  user_id: string
  business_name: string
  description: string
  bio: string | null
  specialization: string[]
  experience: number
  location: string
  verification_status: 'pending' | 'approved' | 'rejected'
  verification_evidence: string[]
  certificates: string[]
  created_at: string
  user?: {
    email: string
    full_name: string
    phone: string
    first_name: string
    last_name: string
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProviders: 0,
    pendingVerifications: 0,
    approvedProviders: 0,
    rejectedProviders: 0
  })
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/unauthorized')
      return
    }

    if (user && user.role === 'admin') {
      fetchData()
    }
  }, [user, authLoading, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      // Fetch all providers (admin needs to see ALL statuses: pending, approved, rejected)
      const providersRes = await fetch('/api/providers?include_all_statuses=true')
      if (providersRes.ok) {
        const data = await providersRes.json()
        setProviders(data.providers || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (providerId: string, action: 'approve' | 'reject') => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          action,
          feedback: feedback || undefined
        })
      })

      if (response.ok) {
        await fetchData()
        setShowDialog(false)
        setSelectedProvider(null)
        setFeedback('')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (providerId: string) => {
    if (!confirm('Are you sure you want to delete this provider? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/providers/${providerId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const openDialog = (provider: Provider, action: 'approve' | 'reject') => {
    setSelectedProvider(provider)
    setDialogAction(action)
    setShowDialog(true)
  }

  const pendingProviders = providers.filter(p => p.verification_status === 'pending')
  const approvedProviders = providers.filter(p => p.verification_status === 'approved')
  const rejectedProviders = providers.filter(p => p.verification_status === 'rejected')

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-purple-100">Manage TalentNest Platform</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">Welcome back,</p>
              <p className="font-semibold">{user?.fullName || user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.totalProviders}</div>
                <UserCheck className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-yellow-500 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/verification')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.pendingVerifications}</div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              {stats.pendingVerifications > 0 && (
                <div className="mt-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Review Now →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.approvedProviders}</div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.rejectedProviders}</div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Providers Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Provider Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Pending ({pendingProviders.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved ({approvedProviders.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejected ({rejectedProviders.length})
                </TabsTrigger>
              </TabsList>

              {/* Pending Tab */}
              <TabsContent value="pending" className="space-y-4 mt-6">
                {pendingProviders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending verifications</p>
                  </div>
                ) : (
                  pendingProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onApprove={() => openDialog(provider, 'approve')}
                      onReject={() => openDialog(provider, 'reject')}
                      onDelete={() => handleDelete(provider.id)}
                    />
                  ))
                )}
              </TabsContent>

              {/* Approved Tab */}
              <TabsContent value="approved" className="space-y-4 mt-6">
                {approvedProviders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No approved providers yet</p>
                  </div>
                ) : (
                  approvedProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onDelete={() => handleDelete(provider.id)}
                      isApproved
                    />
                  ))
                )}
              </TabsContent>

              {/* Rejected Tab */}
              <TabsContent value="rejected" className="space-y-4 mt-6">
                {rejectedProviders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No rejected providers</p>
                  </div>
                ) : (
                  rejectedProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onDelete={() => handleDelete(provider.id)}
                      isRejected
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Provider' : 'Reject Provider'}
            </DialogTitle>
            <DialogDescription>
              {selectedProvider?.business_name} - {selectedProvider?.user?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Feedback (Optional)</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  dialogAction === 'approve'
                    ? 'Welcome message or additional notes...'
                    : 'Reason for rejection...'
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedProvider && handleAction(selectedProvider.id, dialogAction!)}
              disabled={actionLoading}
              className={dialogAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {actionLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <>{dialogAction === 'approve' ? 'Approve' : 'Reject'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Provider Card Component
function ProviderCard({
  provider,
  onApprove,
  onReject,
  onDelete,
  isApproved,
  isRejected
}: {
  provider: Provider
  onApprove?: () => void
  onReject?: () => void
  onDelete: () => void
  isApproved?: boolean
  isRejected?: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={`${isApproved ? 'border-green-200 bg-green-50/30' : isRejected ? 'border-red-200 bg-red-50/30' : 'border-yellow-200 bg-yellow-50/30'}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{provider.business_name}</h3>
              <Badge variant={isApproved ? 'default' : isRejected ? 'destructive' : 'secondary'}>
                {provider.verification_status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Owner:</strong> {provider.user?.full_name || 'N/A'}</p>
              <p><strong>Email:</strong> {provider.user?.email}</p>
              <p><strong>Phone:</strong> {provider.user?.phone}</p>
              <p><strong>Specialization:</strong> {provider.specialization.join(', ')}</p>
              <p><strong>Experience:</strong> {provider.experience} years</p>
              <p><strong>Location:</strong> {provider.location}</p>
            </div>

            {expanded && (
              <div className="mt-4 space-y-2">
                <p className="text-sm"><strong>Description:</strong> {provider.description || provider.bio}</p>
                {provider.verification_evidence.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Documents ({provider.verification_evidence.length}):</p>
                    <div className="grid grid-cols-2 gap-2">
                      {provider.verification_evidence.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Document {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Less' : 'Details'}
            </Button>
            
            {!isApproved && !isRejected && onApprove && onReject && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={onApprove}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onReject}
                >
                  <ThumbsDown className="w-4 h-4 mr-1" /> Reject
                </Button>
              </>
            )}
            
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
