import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Shield, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="relative w-full max-w-2xl space-y-8">
          <div className="text-center">
            <Image
              src="/images/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={96}
              height={96}
              className="mx-auto mb-3"
            />
            <h1 className="text-3xl font-bold text-sky-700">TalentNest</h1>
            <p className="text-sm text-sky-500">University of Ilorin Skills Platform</p>
          </div>

          <Card className="w-full border border-sky-100 shadow-lg">
            <CardHeader className="text-center space-y-4 pt-6">
              <div className="w-20 h-20 mx-auto bg-sky-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-sky-700">Registration Successful</CardTitle>
                <CardDescription className="text-base text-sky-500">Welcome to the TalentNest community</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
                  <h3 className="font-semibold text-sky-700 mb-1">Account Created Successfully</h3>
                  <p className="text-sky-600 text-sm">Your account has been created. You can now access the dashboard and explore the platform.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sky-700">What&apos;s Next?</h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-sky-100">
                    <Mail className="h-5 w-5 text-sky-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sky-700">Check Your Email</h4>
                      <p className="text-sm text-sky-600">We&apos;ve sent a welcome email with information to get started.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-sky-100">
                    <Home className="h-5 w-5 text-sky-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sky-700">Explore the Platform</h4>
                      <p className="text-sm text-sky-600">Browse skills, connect with artisans, and begin learning.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-sky-100 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sky-700">Artisan Verification</h4>
                    <p className="text-sm text-sky-600 mt-1">If you registered as an artisan, your application will be reviewed. You will be notified via email.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button asChild className="flex-1 bg-sky-600 hover:bg-sky-700 text-white">
                  <Link href="/dashboard" className="flex items-center justify-center">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="flex-1 border-sky-200 text-sky-700">
                  <Link href="/marketplace" className="flex items-center justify-center">Explore Marketplace</Link>
                </Button>
              </div>

              <div className="text-center text-sm text-sky-500 pt-4 border-t">
                <p>
                  Need help? Contact our support team at {" "}
                  <a href="mailto:support@talentnest.unilorin.edu.ng" className="text-sky-600 hover:underline">support@talentnest.unilorin.edu.ng</a>
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