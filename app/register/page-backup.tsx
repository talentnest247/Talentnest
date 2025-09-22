"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import StudentRegistrationForm from "@/components/auth/student-registration-form"
import ArtisanRegistrationForm from "@/components/auth/artisan-registration-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { GraduationCap, Briefcase, Users, Shield } from "lucide-react"

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "artisan" | null>(null)

  const handleBackToSelection = () => {
    setSelectedRole(null)
  }

  if (selectedRole) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 py-8 bg-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
          
          {/* Content */}
          <div className="relative w-full max-w-2xl space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">TN</span>
              </div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                TalentNest Registration
              </h1>
              <p className="text-blue-700 font-medium">University of Ilorin Services Platform</p>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToSelection}
                className="mt-6 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                ← Back to Role Selection
              </Button>
            </div>
            
            {selectedRole === "student" && (
              <StudentRegistrationForm />
            )}
            
            {selectedRole === "artisan" && (
              <ArtisanRegistrationForm />
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-8 bg-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
        
        {/* Content */}
        <div className="relative w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">TN</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
              Join TalentNest
            </h1>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto font-medium">
              University of Ilorin&apos;s Premier Services & Marketing Platform
            </p>
            <p className="text-blue-600">
              Choose your registration type to get started
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Registration */}
            <Card className="relative overflow-hidden bg-white border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg" onClick={() => setSelectedRole("student")}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center space-y-4 relative z-10">
                <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">Student Registration</CardTitle>
                  <CardDescription className="text-blue-700 text-base">
                    Join as a University of Ilorin student to find professional services and connect with expert providers
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">Access to all service providers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">Connect with verified professionals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">University-backed platform</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">Campus community access</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    <Users className="h-3 w-3 mr-1" />
                    Instant Access
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Service Provider Registration */}
            <Card className="relative overflow-hidden bg-white border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg" onClick={() => setSelectedRole("artisan")}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center space-y-4 relative z-10">
                <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">Service Provider Registration</CardTitle>
                  <CardDescription className="text-blue-700 text-base">
                    Share your expertise and build your business within the UNILORIN community
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">Market your services to students</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">Build your client base</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">Showcase your portfolio</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">Earn from your services</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Verification Required
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-blue-600 max-w-2xl mx-auto">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-800 hover:underline font-medium">
                Sign in here
              </a>
            </p>
            <p className="mt-2">
              By registering, you agree to our{" "}
              <a href="/terms" className="text-blue-800 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-800 hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
