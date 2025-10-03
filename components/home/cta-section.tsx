"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, Star, CheckCircle2 } from "lucide-react"

export function CTASection() {

  return (
    <section id="cta-section" className="relative py-24 bg-gradient-to-b from-white via-white to-gray-50 overflow-hidden">
      {/* Gradient Edges for Smooth Transition */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top edge - subtle blue fade from features section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50/40 to-transparent"></div>
        {/* Bottom edge - fade to dark for footer transition */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-gray-100/50 to-gray-200/70"></div>
        {/* Decorative blur circles */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-4 py-2 mb-6 shadow-lg">
              <Sparkles className="h-4 w-4 mr-2 inline" />
              Start Today
            </Badge>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Ready to Find Your
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Perfect Service?</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of UNILORIN students already using TalentNest to connect with 
              skilled artisans and service providers. Start booking today!
            </p>

            {/* Trust Indicators */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-gray-700">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span>Free to browse and compare services</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span>Verified artisans with reviews and ratings</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span>Secure payment and satisfaction guarantee</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Start Booking Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl transition-all duration-300">
                  Become a Provider
                  <Users className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Stats Cards */}
          <div className="space-y-6">
            <Card className="bg-white border-2 border-gray-100 shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Active Users</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">10,000+</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-2xl shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="text-gray-600">Students & artisans using TalentNest daily</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-100 shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Average Rating</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">4.9/5</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                    <Star className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>
                <p className="text-gray-600">Satisfaction score from our community</p>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-blue-600">💡 Pro Tip:</span> Complete your profile to get better matches 
                and exclusive offers from top-rated service providers!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
