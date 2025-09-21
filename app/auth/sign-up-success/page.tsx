import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Clock, Shield, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignUpSuccessPage() {
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
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              TalentNest
            </h1>
            <p className="text-sm text-muted-foreground">University of Ilorin Skills Platform</p>
          </div>

          <Card className="w-full glass-card shadow-2xl animate-in fade-in slide-in-from-bottom delay-200">
            <CardHeader className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Registration Successful!
                </CardTitle>
                <CardDescription className="text-base">
                  Welcome to the TalentNest community
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    🎉 Account Created Successfully
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Your account has been created and you&apos;re now part of the University of Ilorin&apos;s 
                    premier skills and learning platform.
                  </p>
                </div>
              </div>

              {/* Next Steps for Students */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What&apos;s Next?</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">Check Your Email</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        We&apos;ve sent a welcome email with important information about getting started.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Home className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-800 dark:text-purple-200">Explore the Platform</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Browse skills, connect with artisans, and start your learning journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Artisan Verification Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                      Artisan Verification Process
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      If you registered as an artisan, your application is now under review. 
                      Our admin team will verify your credentials and notify you via email within 1-3 business days.
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="text-xs text-amber-600">Review typically takes 1-3 business days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href="/dashboard" className="flex items-center justify-center">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/marketplace" className="flex items-center justify-center">
                    Explore Marketplace
                  </Link>
                </Button>
              </div>

              {/* Support Info */}
              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                <p>
                  Need help? Contact our support team at{" "}
                  <a href="mailto:support@talentnest.unilorin.edu.ng" className="text-blue-600 hover:underline">
                    support@talentnest.unilorin.edu.ng
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}