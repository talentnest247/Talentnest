"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Check, X, Users, Briefcase } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ArtisanVerification } from '@/components/admin/artisan-verification'
import { User } from '@/lib/types'

export default function AdminVerificationPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('artisans')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users?verificationStatus=pending')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast({
        title: "Error",
        description: "Failed to load pending users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStudentVerification = async (userId: string, action: 'verified' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, accountType: 'student' }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Student ${action === 'verified' ? 'verified' : 'rejected'} successfully`,
        })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: `Failed to ${action} student`,
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
    }
  }

  // Filter users by account type
  const pendingStudents = users.filter(
    user => user.accountType === 'student' && user.verificationStatus === 'pending'
  )
  const pendingArtisans = users.filter(
    user => user.accountType === 'artisan' && user.verificationStatus === 'pending'
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Verification</h1>
        <p className="text-gray-600">Review and verify pending user registrations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="artisans" className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span>Artisans</span>
            <Badge variant="secondary">{pendingArtisans.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Students</span>
            <Badge variant="secondary">{pendingStudents.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artisans" className="mt-6">
          <ArtisanVerification 
            users={users} 
            onVerificationUpdate={fetchUsers} 
          />
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Student Verification</h2>
                <p className="text-gray-600">Review and verify student registrations</p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {pendingStudents.length} Pending
              </Badge>
            </div>

            {pendingStudents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No pending student verifications</p>
                  <p className="text-gray-400 text-sm">All student applications have been processed</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Student Applications</CardTitle>
                  <CardDescription>
                    {pendingStudents.length} students waiting for verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Details</TableHead>
                        <TableHead>Academic Info</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingStudents.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <Badge 
                                className="w-fit mt-1 bg-blue-100 text-blue-800"
                                variant="secondary"
                              >
                                Student
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              {user.matricNumber && (
                                <div className="text-sm">
                                  <span className="font-medium">Matric:</span> {user.matricNumber}
                                </div>
                              )}
                              {user.faculty && (
                                <div className="text-sm">
                                  <span className="font-medium">Faculty:</span> {user.faculty}
                                </div>
                              )}
                              {user.department && (
                                <div className="text-sm">
                                  <span className="font-medium">Dept:</span> {user.department}
                                </div>
                              )}
                              {user.level && (
                                <div className="text-sm">
                                  <span className="font-medium">Level:</span> {user.level}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              {user.phoneNumber && (
                                <div className="text-sm">{user.phoneNumber}</div>
                              )}
                              {user.whatsappNumber && (
                                <div className="text-sm text-green-600">{user.whatsappNumber}</div>
                              )}
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
                                onClick={() => {
                                  // TODO: Open student details modal
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStudentVerification(user.id, 'verified')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStudentVerification(user.id, 'rejected')}
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}