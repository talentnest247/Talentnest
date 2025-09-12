'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  Clock, 
  FileText,
  Download,
  Check,
  X,
  AlertTriangle
} from 'lucide-react'

interface ArtisanVerificationData {
  id: string
  user_id: string
  business_name: string
  business_registration_number?: string
  trade_category: string
  years_of_experience: number
  location: string
  description: string
  verification_status: 'pending' | 'approved' | 'rejected'
  verification_notes?: string
  created_at: string
  user: {
    full_name: string
    email: string
    phone?: string
  }
  documents: Array<{
    id: string
    document_type: string
    file_url: string
    file_name: string
    file_size: number
    uploaded_at: string
  }>
}

export function ArtisanVerificationList() {
  const [artisans, setArtisans] = useState<ArtisanVerificationData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const supabase = createClient()

  const loadArtisans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('artisan_profiles')
        .select(`
          *,
          user:users(full_name, email, phone),
          documents:artisan_documents(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setArtisans(data || [])
    } catch (error: unknown) {
      console.error('Error loading artisans:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load artisan applications'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadArtisans()
  }, [loadArtisans])

  const updateVerificationStatus = async (
    profileId: string, 
    status: 'approved' | 'rejected', 
    notes?: string
  ) => {
    try {
      // Update artisan profile
      const { error: profileError } = await supabase
        .from('artisan_profiles')
        .update({
          verification_status: status,
          verification_notes: notes,
          verified_at: new Date().toISOString()
        })
        .eq('id', profileId)

      if (profileError) throw profileError

      // Update user active status
      const artisan = artisans.find(a => a.id === profileId)
      if (artisan) {
        const { error: userError } = await supabase
          .from('users')
          .update({
            is_active: status === 'approved',
            is_verified: status === 'approved'
          })
          .eq('id', artisan.user_id)

        if (userError) throw userError
      }

      toast.success(`Artisan ${status} successfully`)
      loadArtisans()
    } catch (error: unknown) {
      console.error('Error updating verification:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update verification status'
      toast.error(errorMessage)
    }
  }

  const downloadDocument = async (fileUrl: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('artisan-documents')
        .download(fileUrl)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error: unknown) {
      console.error('Error downloading document:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to download document'
      toast.error(errorMessage)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredArtisans = artisans.filter(artisan => 
    activeTab === 'all' ? true : artisan.verification_status === activeTab
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading artisan applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Artisan Verification</h1>
          <p className="text-muted-foreground">Review and verify artisan applications</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({artisans.filter(a => a.verification_status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({artisans.filter(a => a.verification_status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({artisans.filter(a => a.verification_status === 'rejected').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({artisans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredArtisans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'pending' 
                    ? 'No pending artisan applications at the moment.'
                    : `No ${activeTab} artisan applications found.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredArtisans.map((artisan) => (
              <Card key={artisan.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {artisan.user.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{artisan.business_name}</CardTitle>
                        <CardDescription className="text-base">
                          {artisan.user.full_name} • {artisan.trade_category}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {getStatusBadge(artisan.verification_status)}
                      <p className="text-sm text-muted-foreground">
                        Applied {formatDate(artisan.created_at)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{artisan.user.email}</span>
                        </div>
                        {artisan.user.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{artisan.user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{artisan.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        Business Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{artisan.trade_category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{artisan.years_of_experience} years experience</span>
                        </div>
                        {artisan.business_registration_number && (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Reg: {artisan.business_registration_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Business Description */}
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
                      Business Description
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{artisan.description}</p>
                  </div>

                  {/* Documents */}
                  {artisan.documents && artisan.documents.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                        Supporting Documents ({artisan.documents.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {artisan.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium truncate">{doc.file_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(doc.file_size)} • {formatDate(doc.uploaded_at)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadDocument(doc.file_url, doc.file_name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verification Notes */}
                  {artisan.verification_notes && (
                    <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
                        Verification Notes
                      </h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {artisan.verification_notes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {artisan.verification_status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <Button
                        variant="default"
                        onClick={() => updateVerificationStatus(artisan.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const notes = prompt('Reason for rejection (optional):')
                          updateVerificationStatus(artisan.id, 'rejected', notes || undefined)
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
