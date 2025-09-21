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
        <main className="flex-1 flex items-center justify-center p-4 py-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* Content */}
          <div className="relative w-full max-w-2xl space-y-8 animate-in slide-in-from-bottom duration-1000">
            <div className="text-center">
              <Image
                src="/images/unilorin-logo.png"
                alt="University of Ilorin Logo"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TalentNest Registration
              </h1>
              <p className="text-sm text-muted-foreground">University of Ilorin Skills Platform</p>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToSelection}
                className="mt-4"
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Content */}
        <div className="relative w-full max-w-4xl space-y-8 animate-in slide-in-from-bottom duration-1000">
          <div className="text-center space-y-4">
            <Image
              src="/images/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join TalentNest
            </h1>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              University of Ilorin&apos;s Premier Skills & Learning Platform
            </p>
            <p className="text-sm text-blue-500">
              Choose your registration type to get started
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Registration */}
            <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer group" onClick={() => setSelectedRole("student")}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Student Registration</CardTitle>
                  <CardDescription className="text-base">
                    Join as a University of Ilorin student to learn new skills and connect with expert artisans
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Access to all skill courses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Connect with verified artisans</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">University-backed certificates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Campus community access</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <Users className="h-3 w-3 mr-1" />
                    Instant Access
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Artisan Registration */}
            <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 hover:border-purple-500 transition-all duration-300 hover:scale-105 cursor-pointer group" onClick={() => setSelectedRole("artisan")}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">Artisan Registration</CardTitle>
                  <CardDescription className="text-base">
                    Share your expertise and build your business within the UNILORIN community
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Teach and mentor students</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Build your client base</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Showcase your portfolio</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Earn from your skills</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Verification Required
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in here
              </a>
            </p>
            <p className="mt-2">
              By registering, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
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
