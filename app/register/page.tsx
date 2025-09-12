import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Hammer, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join TalentNest</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect students with skilled artisans. Choose your account type to get started.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Registration */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <GraduationCap className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Student Account</CardTitle>
              <CardDescription className="text-base">
                Connect with skilled artisans and learn from experts in various trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Find verified artisans in your area</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Access learning resources and tutorials</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Book apprenticeships and training sessions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Track your learning progress</p>
                </div>
              </div>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/register/student" className="flex items-center justify-center">
                  Register as Student
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Artisan Registration */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
                <Hammer className="h-12 w-12 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-orange-700">Artisan Account</CardTitle>
              <CardDescription className="text-base">
                Share your skills, mentor students, and grow your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Showcase your work and expertise</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Connect with eager students</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Earn income through teaching and services</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">Build your professional reputation</p>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-orange-800 font-medium">
                  ⚠️ Artisan accounts require admin verification (2-3 business days)
                </p>
              </div>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href="/register/artisan" className="flex items-center justify-center">
                  Register as Artisan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
