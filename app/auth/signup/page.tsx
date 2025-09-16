"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase } from 'lucide-react'

export default function AuthSignupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Join TalentNest</h1>
          <p className="text-gray-600">Choose your account type to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Student Account</CardTitle>
              <CardDescription>
                Connect with talented artisans and service providers on campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Browse and book services</li>
                <li>• Leave reviews and ratings</li>
                <li>• Access to all marketplace features</li>
                <li>• Direct communication with providers</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => router.push('/register/student')}
              >
                Sign Up as Student
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Artisan Account</CardTitle>
              <CardDescription>
                Showcase your skills and grow your business on campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Create and manage services</li>
                <li>• Receive bookings and payments</li>
                <li>• Build your professional profile</li>
                <li>• Verification badge for credibility</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => router.push('/register/artisan')}
              >
                Sign Up as Artisan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold"
              onClick={() => router.push('/login')}
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}