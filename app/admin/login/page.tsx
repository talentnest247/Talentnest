'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Eye, EyeOff, Loader2, AlertCircle, Lock, Mail, Key } from 'lucide-react'

const ADMIN_ACCESS_CODE = 'UNILORIN-ADMIN-2025'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: 'talentnest247@gmail.com',
    password: 'talentnest247',
    accessCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate access code
    if (formData.accessCode.toUpperCase() !== ADMIN_ACCESS_CODE) {
      setError('Invalid access code. Please check and try again.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          accessCode: formData.accessCode
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-purple-200">TalentNest Administration</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Secure Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="animate-in fade-in-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@talentnest.com"
                  required
                  className="h-11 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    className="h-11 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Access Code Input */}
              <div className="space-y-2">
                <Label htmlFor="accessCode" className="flex items-center gap-2 text-gray-700">
                  <Key className="w-4 h-4" />
                  Admin Access Code
                </Label>
                <Input
                  id="accessCode"
                  type="text"
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                  placeholder="UNILORIN-ADMIN-2025"
                  required
                  className="h-11 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500 font-mono"
                />
                <p className="text-xs text-gray-500">Contact administrator if you don&apos;t have an access code</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Access Admin Portal
                  </>
                )}
              </Button>
            </form>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-purple-900 space-y-1">
                  <p className="font-semibold">Security Notice</p>
                  <p>This is a protected area. All access attempts are logged and monitored.</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-6">
            <div className="w-full text-center text-sm text-gray-600">
              Need help?{' '}
              <Link href="/help" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                Contact Support
              </Link>
            </div>
            <div className="w-full text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                ← Back to Home
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white/80 text-sm">
          <p>© 2025 TalentNest. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
