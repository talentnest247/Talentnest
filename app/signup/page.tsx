"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StudentRegisterForm } from "@/components/auth/student-register-form"
import { ArtisanRegisterForm } from "@/components/auth/artisan-register-form"
import { Users, Briefcase, ArrowLeft, GraduationCap, Award, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'artisan' | null>(null)

  if (selectedRole === 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <Image 
                    src="/unilorin-logo.png" 
                    alt="University of Ilorin Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TalentNest
                  </h1>
                  <p className="text-sm text-gray-600">Student Services Platform</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setSelectedRole(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to selection</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl w-16 h-16 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
              <p className="text-gray-600">
                Join TalentNest to discover and book services from talented student artisans
              </p>
            </div>
            <StudentRegisterForm />
          </div>
        </div>
      </div>
    )
  }

  if (selectedRole === 'artisan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <Image 
                    src="/unilorin-logo.png" 
                    alt="University of Ilorin Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TalentNest
                  </h1>
                  <p className="text-sm text-gray-600">Student Services Platform</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setSelectedRole(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to selection</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl w-16 h-16 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Artisan Registration</h1>
              <p className="text-gray-600">
                Showcase your skills and offer professional services to fellow students
              </p>
              <Badge variant="secondary" className="mt-2">
                Verification Required
              </Badge>
            </div>
            <ArtisanRegisterForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TalentNest
                </h1>
                <p className="text-sm text-gray-600">Student Services Platform</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Join <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TalentNest</span>
              </h1>
              <p className="text-xl text-gray-600 mb-2">Connect, Learn, and Grow Together</p>
              <p className="text-gray-500">Choose your account type to get started on your journey</p>
            </div>          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Student Registration Card */}
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 hover:border-blue-500 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Student Account</CardTitle>
                <CardDescription className="text-gray-600">
                  Discover and book services from talented student artisans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Browse available services
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Book appointments easily
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Rate and review services
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Connect with skilled peers
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Shield className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Student Verification Required</span>
                  </div>
                  <p className="text-xs text-blue-600">Valid matric number and student ID required for verification</p>
                </div>

                <Button
                  onClick={() => setSelectedRole('student')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  size="lg"
                >
                  Register as Student
                </Button>
              </CardContent>
            </Card>

            {/* Artisan Registration Card */}
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 hover:border-purple-500 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Artisan Account</CardTitle>
                <CardDescription className="text-gray-600">
                  Showcase your skills and offer services to fellow students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Create your service portfolio
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Set your own pricing
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Manage bookings & earnings
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Build your reputation
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Award className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-purple-800">Enhanced Verification Process</span>
                  </div>
                  <p className="text-xs text-purple-600">Matric number + skill certificates + bio documentation required</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                    Admin Approval Required
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                    Document Upload
                  </Badge>
                </div>

                <Button
                  onClick={() => setSelectedRole('artisan')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  size="lg"
                >
                  Register as Artisan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Sign in here
              </a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
