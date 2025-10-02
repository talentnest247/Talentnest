"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Shield, Eye, EyeOff, Loader2, AlertCircle, Lock,
  UserCheck, Settings, BarChart3
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminCode: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminCode, setShowAdminCode] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate required fields
    if (!formData.email || !formData.password || !formData.adminCode) {
      setError("All fields are required for admin access")
      return
    }

    // Validate admin code (in a real app, this would be more secure)
    if (formData.adminCode !== "UNILORIN-ADMIN-2025") {
      setError("Invalid admin access code")
      return
    }

    // Validate admin email 
    if (formData.email !== "talentnest247@gmail.com") {
      setError("Please use the correct admin email address")
      return
    }

    // Validate admin password
    if (formData.password !== "talentnest247") {
      setError("Invalid admin password")
      return
    }

    try {
      // Since all validations passed, simulate admin login with password
      const success = await login(formData.email, formData.password)

      if (success) {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the TalentNest administration panel",
        })
        router.push("/admin/dashboard")
      } else {
        setError("Admin login failed. Please try again.")
      }
    } catch (error) {
      console.error("Admin login error:", error)
      setError("An error occurred during login. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Admin Login Card */}
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Admin Access Portal
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-base mt-2">
                    TalentNest Administration Panel
                  </CardDescription>
                </div>
                
                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 bg-white/10 rounded-full px-4 py-2 mx-auto w-fit">
                  <Lock className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-200 text-sm">Secure Admin Login</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Logo */}
              <div className="text-center mb-6">
                <Image
                  src="/images/unilorin-logo.png"
                  alt="UniLorin Logo"
                  width={60}
                  height={60}
                  className="mx-auto mb-3"
                />
                <p className="text-sm text-gray-600">University of Ilorin - TalentNest</p>
              </div>

              {/* Admin Features Preview */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <UserCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-blue-700 font-medium">User Management</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-green-700 font-medium">Analytics</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-purple-700 font-medium">System Control</p>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Admin Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm font-medium text-blue-900">
                    Admin Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="talentnest247@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-blue-200 focus:border-blue-500 bg-white"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="block text-sm font-medium text-blue-900">
                    Admin Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your admin password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pr-12 border-blue-200 focus:border-blue-500 bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Admin Access Code */}
                <div className="space-y-2">
                  <Label htmlFor="adminCode" className="block text-sm font-medium text-blue-900">
                    Admin Access Code <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="adminCode"
                      name="adminCode"
                      type={showAdminCode ? "text" : "password"}
                      placeholder="Enter admin access code"
                      value={formData.adminCode}
                      onChange={(e) => handleInputChange("adminCode", e.target.value)}
                      className="pr-12 border-blue-200 focus:border-blue-500 bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminCode(!showAdminCode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                    >
                      {showAdminCode ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Contact system administrator for access code
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Access Admin Panel
                    </>
                  )}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Security Notice</p>
                    <ul className="space-y-1 text-xs">
                      <li>• All admin actions are logged and monitored</li>
                      <li>• Unauthorized access attempts will be reported</li>
                      <li>• Use strong passwords and keep credentials secure</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Back to Regular Login */}
              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Not an admin?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    Student/Provider Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Admin Support */}
          <Card className="mt-6 bg-white/90 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-blue-900 mb-2">Need Admin Access?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact the TalentNest system administrator for admin credentials and access codes.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 Email: admin@talentnest.unilorin.edu.ng</p>
                <p>📞 Phone: +234 XXX XXX XXXX</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}