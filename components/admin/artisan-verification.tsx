'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Eye, 
  Check, 
  X, 
  Download, 
  Phone, 
  UserIcon, 
  Briefcase, 
  FileText, 
  ExternalLink
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { User } from '@/lib/types'

interface ArtisanVerificationProps {
  users: User[]
  onVerificationUpdate: () => void
}

export function ArtisanVerification({ users, onVerificationUpdate }: ArtisanVerificationProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter artisans pending verification
  const pendingArtisans = users.filter(
    user => user.accountType === 'artisan' && user.verificationStatus === 'pending'
  )

  const handleVerification = async (userId: string, action: 'verified' | 'rejected', notes?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action,
          verificationNotes: notes || verificationNotes,
          accountType: 'artisan'
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Artisan ${action === 'verified' ? 'verified' : 'rejected'} successfully`,
        })
        onVerificationUpdate()
        setIsModalOpen(false)
        setVerificationNotes('')
        setSelectedUser(null)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${action} artisan`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast({
        title: "Error",
        description: 'An error occurred during verification',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openUserModal = (user: User) => {
    setSelectedUser(user)
    setVerificationNotes('')
    setIsModalOpen(true)
  }

  const downloadCertificate = (url: string) => {
    // In a real app, this would handle secure file downloads
    window.open(url, '_blank')
  }

  const getSkillsDisplay = (skills: string[]) => {
    if (skills.length === 0) return 'No skills listed'
    if (skills.length <= 3) return skills.join(', ')
    return `${skills.slice(0, 3).join(', ')} +${skills.length - 3} more`
  }

  const getAccountTypeColor = (accountType: string) => {
    switch (accountType) {
      case 'artisan': return 'bg-green-100 text-green-800'
      case 'student': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Artisan Verification</h2>
          <p className="text-gray-600">Review and verify artisan applications</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {pendingArtisans.length} Pending
        </Badge>
      </div>

      {pendingArtisans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No pending artisan verifications</p>
            <p className="text-gray-400 text-sm">All artisan applications have been processed</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pending Artisan Applications</CardTitle>
            <CardDescription>
              Review certificates, experience, and skills before verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artisan Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Skills Overview</TableHead>
                  <TableHead>Certificates</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingArtisans.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <Badge 
                          className={`w-fit mt-1 ${getAccountTypeColor(user.accountType)}`}
                          variant="secondary"
                        >
                          {user.accountType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        {user.phoneNumber && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phoneNumber}
                          </div>
                        )}
                        {user.whatsappNumber && (
                          <div className="flex items-center text-sm text-green-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.whatsappNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm font-medium">
                          {getSkillsDisplay(user.skills)}
                        </div>
                        {user.bio && (
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {user.bio.substring(0, 60)}...
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-blue-600" />
                        <span className="text-sm">
                          {user.certificates.length} file{user.certificates.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUserModal(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleVerification(user.id, 'verified')}
                          disabled={loading}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleVerification(user.id, 'rejected')}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Detailed Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Review Artisan Application</span>
                </DialogTitle>
                <DialogDescription>
                  Detailed review of {selectedUser.fullName}&apos;s artisan application
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Full Name</Label>
                        <p className="text-sm">{selectedUser.fullName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm">{selectedUser.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Phone Number</Label>
                        <p className="text-sm">{selectedUser.phoneNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">WhatsApp Number</Label>
                        <p className="text-sm">{selectedUser.whatsappNumber || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Bio */}
                    <div>
                      <Label className="text-sm font-medium">Professional Bio</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                        {selectedUser.bio || 'No bio provided'}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <Label className="text-sm font-medium">Experience & Expertise</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                        {selectedUser.experience || 'No experience details provided'}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <Label className="text-sm font-medium">Skills</Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedUser.skills.length > 0 ? (
                          selectedUser.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No skills listed</p>
                        )}
                      </div>
                    </div>

                    {/* Portfolio Links */}
                    {selectedUser.portfolioLinks.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Portfolio Links</Label>
                        <div className="mt-1 space-y-2">
                          {selectedUser.portfolioLinks.map((link: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <ExternalLink className="h-4 w-4 text-blue-600" />
                              <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline truncate"
                              >
                                {link}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Certificates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certificates & Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUser.certificates.length > 0 ? (
                      <div className="space-y-2">
                        {selectedUser.certificates.map((cert: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">Certificate {index + 1}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadCertificate(cert)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No certificates uploaded</p>
                    )}
                  </CardContent>
                </Card>

                {/* Verification Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Admin Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add notes about the verification decision..."
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-gray-500">
                        These notes will be sent to the artisan with the verification decision
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerification(selectedUser.id, 'rejected', verificationNotes)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {loading ? 'Processing...' : 'Reject'}
                  </Button>
                  <Button
                    onClick={() => handleVerification(selectedUser.id, 'verified', verificationNotes)}
                    disabled={loading}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {loading ? 'Processing...' : 'Approve'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
