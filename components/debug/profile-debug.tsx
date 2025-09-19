'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, AlertCircle } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface ProfileData {
  id: string
  email: string
  full_name: string
  phone_number?: string
  whatsapp_number?: string
  faculty?: string
  department?: string
  level?: string
  bio?: string
  user_type: string
  account_type: string
  is_verified: boolean
  total_rating: number
  total_reviews: number
  created_at: string
}

interface ProfileDebugProps {
  userId: string
}

export function ProfileDebug({ userId }: ProfileDebugProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [authData, setAuthData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const checkProfile = useCallback(async () => {
    setLoading(true)
    try {
      // Check auth user
      const { data: { user } } = await supabase.auth.getUser()
      setAuthData(user)

      // Check profile in database
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Profile check error:', error)
      }
      
      setProfileData(profile)
    } catch (error) {
      console.error('Debug check error:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, userId])

  useEffect(() => {
    checkProfile()
  }, [checkProfile])

  const createProfile = async () => {
    if (!authData) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          id: authData.id,
          email: authData.email || '',
          full_name: authData.user_metadata?.full_name || 'User',
          phone_number: '',
          whatsapp_number: '',
          faculty: '',
          department: '',
          level: '',
          bio: '',
          user_type: 'student',
          account_type: 'student',
          is_verified: false,
          total_rating: 0,
          total_reviews: 0,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Profile creation error:', error)
        alert('Error creating profile: ' + error.message)
      } else {
        alert('Profile created successfully!')
        checkProfile()
      }
    } catch (error) {
      console.error('Profile creation error:', error)
      alert('Error creating profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Checking profile status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Profile Debug Information
        </CardTitle>
        <CardDescription>
          This is a diagnostic view to help understand the profile setup issue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auth Data */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Authentication Data</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(authData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Profile Data */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Profile Data</h3>
          {profileData ? (
            <div className="bg-green-50 p-4 rounded-lg">
              <Alert className="mb-4">
                <AlertDescription>
                  ✓ Profile found in database
                </AlertDescription>
              </Alert>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  ✗ No profile found in database
                </AlertDescription>
              </Alert>
              <Button onClick={createProfile} className="mt-2">
                Create Profile Now
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={checkProfile} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Check
          </Button>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}