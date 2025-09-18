"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, GraduationCap, Award, Sparkles, Star } from 'lucide-react'
import { Header } from '@/components/navigation/header'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-6xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              Join 500+ UNILORIN Students
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Join TalentNest Today
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your account type and start connecting with talented students across University of Ilorin
            </p>
          </div>

          {/* Registration Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Card */}
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Student Account</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Discover amazing services from your fellow UNILORIN students
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Browse and book services from verified artisans
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Leave reviews and build trust in the community
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Direct WhatsApp communication with providers
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Access to exclusive student discounts
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all" 
                  onClick={() => router.push('/register/student')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join as Student
                </Button>
              </CardContent>
            </Card>

            {/* Artisan Card */}
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Artisan Account</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Showcase your talents and grow your business on campus
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Create and manage your service portfolio
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Receive bookings and grow your income
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Get verified with certificate uploads
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Build your professional reputation
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all" 
                  onClick={() => router.push('/register/artisan')}
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Join as Artisan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-semibold">4.8/5</span> Average Rating
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-blue-500 mr-1" />
                <span className="font-semibold">500+</span> Active Students
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-green-500 mr-1" />
                <span className="font-semibold">200+</span> Verified Artisans
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}