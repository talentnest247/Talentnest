"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, BookOpen, Award, Star } from "lucide-react"

export function CTASection() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )
    
    const section = document.getElementById('cta-section')
    if (section) observer.observe(section)
    
    return () => observer.disconnect()
  }, [])

  const benefits = [
    { icon: Users, text: "Join 2,500+ student learners" },
    { icon: BookOpen, text: "150+ peer-taught skills" },
    { icon: Award, text: "University-backed courses" },
    { icon: Star, text: "4.9/5 campus rating" }
  ]

  return (
    <section id="cta-section" className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 dark:from-black dark:via-slate-900 dark:to-emerald-950">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Professional Shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500/15 dark:bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Badge */}
            <div className={`inline-flex transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Badge className="bg-white/20 text-white border border-white/30 px-4 py-2 hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Join UNILORIN Artisan Hub Today
            </Badge>
            </div>

            {/* Main Heading */}
            <div className={`space-y-4 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Ready to Master
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  New Skills?
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
                Join thousands of students who have transformed their careers through our expert-led courses. 
                Start learning today and unlock your creative potential.
              </p>
            </div>

            {/* Benefits */}
            <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {benefits.map((benefit, index) => (
                <div key={index} className={`flex items-center space-x-3 text-white/90 transition-all duration-500 delay-${(index + 1) * 100} ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300">
                    <benefit.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button 
                asChild
                {...({ size: "lg" } as any)}
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl shadow-black/20 transition-all duration-200 hover:scale-105 group"
              >
                <Link href="/register" className="flex items-center space-x-2 text-blue-600">
                  <span className="text-blue-600">Get Started Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              
              <Button 
                asChild
                {...({ variant: "outline", size: "lg" } as any)}
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <Link href="/marketplace" className="text-white hover:text-blue-200">
                  Browse Courses
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-xs">Active Students</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-xs">Average Rating</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">150+</div>
                <div className="text-xs">Available Skills</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Cards */}
          <div className={`relative ${mounted ? 'animate-in slide-in-from-right duration-700 delay-300' : ''}`}>
            <div className="grid grid-cols-2 gap-6">
              {/* Card 1 */}
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center text-white">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-yellow-800" />
                  </div>
                  <h3 className="font-semibold mb-2">Get Certified</h3>
                  <p className="text-sm text-white/80">Earn recognized certificates</p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 mt-8">
                <CardContent className="p-6 text-center text-white">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-green-800" />
                  </div>
                  <h3 className="font-semibold mb-2">Expert Mentors</h3>
                  <p className="text-sm text-white/80">Learn from professionals</p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center text-white">
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-blue-800" />
                  </div>
                  <h3 className="font-semibold mb-2">Practical Skills</h3>
                  <p className="text-sm text-white/80">Hands-on learning approach</p>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 mt-8">
                <CardContent className="p-6 text-center text-white">
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6 text-purple-800" />
                  </div>
                  <h3 className="font-semibold mb-2">Top Rated</h3>
                  <p className="text-sm text-white/80">Highly rated by students</p>
                </CardContent>
              </Card>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
