"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowRight, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  Sparkles,
  Play,
  CheckCircle
} from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { icon: Users, value: "2,500+", label: "Active Artisans" },
    { icon: BookOpen, value: "150+", label: "Skills Available" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Award, value: "95%", label: "Success Rate" }
  ]

  const features = [
    "Connect with skilled artisans",
    "Learn from certified professionals", 
    "Flexible learning schedules",
    "Community-driven platform"
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950">
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-indigo-100/30 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-teal-100/30 dark:from-emerald-950/20 dark:to-teal-950/10 rounded-full blur-3xl"></div>
        
        {/* Professional Grid Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-3 bg-gradient-pattern"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className={`inline-flex transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 text-sm font-medium shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                UNILORIN Student Artisan Hub
              </Badge>
            </div>

            {/* Main Heading */}
            <div className={`space-y-4 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Master Skills,
                </span>
                <br />
                <span className="text-slate-900 dark:text-white">
                  Build Your Future
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed">
                Connect with expert student artisans, learn traditional and modern skills, and become part of UNILORIN's most vibrant creative community.
              </p>
            </div>

            {/* Features List */}
            <div className={`space-y-3 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {features.map((feature, index) => (
                <div key={index} className={`flex items-center space-x-3 text-slate-800 dark:text-slate-100 transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-base font-medium text-slate-800 dark:text-slate-100">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button 
                asChild
                {...({ size: "lg" } as any)}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Link href="/marketplace" className="flex items-center space-x-2">
                  <span className="text-white">Explore Marketplace</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              
              <Button 
                {...({ variant: "outline", size: "lg" } as any)}
                className="border-2 border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              {stats.map((stat, index) => (
                <div key={index} className={`text-center group transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                      <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="font-bold text-xl text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/young-man-technician.png"
                  alt="UNILORIN Student Artisan"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
                
                {/* Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating Cards */}
                <Card className="absolute top-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">4.9 Rating</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">1,250+ Reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">150+ Skills</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Learn & Teach</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
