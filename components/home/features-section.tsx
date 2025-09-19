"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BookOpen, 
  Star, 
  Shield,
  Clock,
  Award,
  Zap,
  Heart,
  Globe,
  ChevronRight,
  Sparkles
} from "lucide-react"

export function FeaturesSection() {
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
    
    const section = document.getElementById('features-section')
    if (section) observer.observe(section)
    
    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Users,
      title: "Expert Student Artisans",
      description: "Connect with skilled UNILORIN students who excel in their crafts and creative skills",
      badge: "Verified",
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Learning",
      description: "Access structured peer-to-peer courses from beginner to advanced levels with hands-on projects",
      badge: "Interactive",
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "All student artisans are vetted and courses are quality-checked by the university community",
      badge: "Guaranteed",
      color: "from-slate-600 to-slate-700"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Learn at your own pace with campus-friendly timing and peer mentorship support",
      badge: "On-demand",
      color: "from-orange-600 to-amber-600"
    },
    {
      icon: Award,
      title: "University Certification",
      description: "Earn recognized certificates backed by UNILORIN and build a portfolio showcasing your skills",
      badge: "Accredited",
      color: "from-indigo-600 to-blue-700"
    },
    {
      icon: Globe,
      title: "Campus Community",
      description: "Join UNILORIN's vibrant community of student creators and skilled artisans",
      badge: "Connected",
      color: "from-teal-600 to-cyan-600"
    }
  ]

  const stats = [
    { value: "98%", label: "Completion Rate", icon: Zap },
    { value: "4.9/5", label: "Student Rating", icon: Star },
    { value: "2.5K+", label: "Active Students", icon: Heart },
    { value: "24/7", label: "Campus Support", icon: Clock }
  ]

  return (
    <section id="features-section" className="relative py-20 lg:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center space-y-6 mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 border-0 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
            Why Choose UNILORIN Hub
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 dark:text-white">
            <span className="bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
              Empowering Students
            </span>
            <br />
            <span className="text-blue-600 dark:text-white">
              Building Futures
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Our platform provides everything you need to master traditional and modern skills, 
            connect with expert artisans, and build a successful career in the creative industry.
          </p>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 ${mounted ? 'animate-in slide-in-from-bottom duration-700 delay-200' : ''}`}>
          {stats.map((stat, index) => (
            <Card key={index} className="text-center bg-white dark:bg-slate-800 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform duration-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group relative bg-white dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 shadow-lg ${
                mounted ? 'animate-in slide-in-from-bottom duration-700' : ''
              }`}
              style={{ animationDelay: `${index * 100 + 400}ms` }}
            >
              {/* Gradient Border on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300`}></div>
              
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <Badge {...({ variant: "secondary" } as any)} className="bg-slate-100 dark:bg-slate-800 dark:text-slate-200 text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-blue-600 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="flex items-center text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-2">
                  <span className="text-sm font-medium mr-2">Learn more</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 ${mounted ? 'animate-in slide-in-from-bottom duration-700 delay-1000' : ''}`}>
          <div className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400">
            <Zap className="h-5 w-5" />
            <span className="font-medium">Ready to start your journey?</span>
          </div>
        </div>
      </div>
    </section>
  )
}
