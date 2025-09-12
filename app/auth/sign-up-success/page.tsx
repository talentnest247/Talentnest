'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Clock, Shield } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SignUpSuccessContent() {
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') // 'student' or 'artisan'
  const isArtisan = userType === 'artisan'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="border-border text-center">
          <CardHeader className="space-y-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isArtisan ? 'bg-orange-100' : 'bg-green-100'
            }`}>
              {isArtisan ? (
                <Clock className="w-8 h-8 text-orange-600" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-serif">
              {isArtisan ? 'Application Submitted!' : 'Check Your Email'}
            </CardTitle>
            <CardDescription className="text-base">
              {isArtisan 
                ? 'Your artisan account application is under review.'
                : 'We&apos;ve sent a confirmation link to your email address.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {isArtisan ? (
                <>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Verification in progress</span>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 text-sm text-gray-700">
                    <p className="font-medium mb-2 text-orange-800">What happens next:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Our admin team will review your application</li>
                      <li>We&apos;ll verify your documents and business information</li>
                      <li>You&apos;ll receive an email notification (2-3 business days)</li>
                      <li>Once approved, you can start offering services!</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    <p><strong>Important:</strong> Please check your email for the account confirmation link as well.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">Check your inbox and spam folder</span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Next steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Open the email from TalentNest</li>
                      <li>Click the confirmation link</li>
                      <li>Complete your profile setup</li>
                      <li>Start connecting with skilled artisans!</li>
                    </ol>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/login">Continue to Sign In</Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SignUpSuccessContent />
    </Suspense>
  )
}
