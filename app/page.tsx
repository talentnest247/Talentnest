'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Shield, MessageCircle, Search, BookOpen } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import Link from "next/link"
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  useEffect(() => {
    // Create intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )
    
    // Observe all elements with scroll-animate class
    const animateElements = document.querySelectorAll('.scroll-animate')
    animateElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el)
      }
    })
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <style jsx global>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-animate-delay-1 {
          transition-delay: 0.1s;
        }
        
        .scroll-animate-delay-2 {
          transition-delay: 0.2s;
        }
        
        .scroll-animate-delay-3 {
          transition-delay: 0.3s;
        }
        
        .hero-animate {
          animation: heroFadeIn 1.2s ease-out forwards;
        }
        
        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {/* Navigation */}
      <Header />

      {/* Hero Section with University Branding */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-teal-900/5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-xl"></div>
        
        <div className="container mx-auto text-center relative">
          <h1 className="hero-animate text-5xl md:text-7xl font-serif font-bold bg-gradient-to-r from-blue-900 via-teal-700 to-blue-800 bg-clip-text text-transparent mb-8 text-balance leading-tight">
            Your University Skills Marketplace
          </h1>
          
          <p className="hero-animate text-xl text-gray-600 mb-12 max-w-4xl mx-auto text-pretty leading-relaxed">
            Connect with talented University of Ilorin students, showcase your skills, and build your portfolio. 
            The trusted platform where our university community offers and discovers professional services.
          </p>
          
          <div className="hero-animate flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-10 py-4 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Start Showcasing Your Skills
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="text-lg px-10 py-4 border-2 border-teal-700 text-teal-800 hover:bg-teal-700 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                Browse Student Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Cards */}
      <section id="services" className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="scroll-animate text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">
              Discover Amazing Student Talent
            </h2>
            <p className="scroll-animate text-xl text-gray-600 max-w-3xl mx-auto">
              From digital design to artisan crafts, find skilled University of Ilorin students ready to help with your projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="scroll-animate border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-serif text-2xl text-blue-900">Digital Services</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Web development, graphic design, content creation, and more digital skills from tech-savvy students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border-0 px-4 py-2">Web Design</Badge>
                  <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border-0 px-4 py-2">Photography</Badge>
                  <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border-0 px-4 py-2">Writing</Badge>
                  <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border-0 px-4 py-2">Coding</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="scroll-animate scroll-animate-delay-1 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-serif text-2xl text-blue-900">Artisan Crafts</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Handmade items, tailoring, jewelry making, and traditional crafts from creative students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 hover:from-teal-200 hover:to-teal-300 border-0 px-4 py-2">Tailoring</Badge>
                  <Badge className="bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 hover:from-teal-200 hover:to-teal-300 border-0 px-4 py-2">Jewelry</Badge>
                  <Badge className="bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 hover:from-teal-200 hover:to-teal-300 border-0 px-4 py-2">Art</Badge>
                  <Badge className="bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 hover:from-teal-200 hover:to-teal-300 border-0 px-4 py-2">Crafts</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="scroll-animate scroll-animate-delay-2 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-serif text-2xl text-blue-900">Learning & Tutoring</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Peer-to-peer learning, skill workshops, and academic tutoring from top-performing students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300 border-0 px-4 py-2">Tutoring</Badge>
                  <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300 border-0 px-4 py-2">Workshops</Badge>
                  <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300 border-0 px-4 py-2">Mentoring</Badge>
                  <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300 border-0 px-4 py-2">Training</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced with University Colors */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="scroll-animate text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-6">How TalentNest Works</h2>
            <p className="scroll-animate text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to connect, collaborate, and grow within the University of Ilorin community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="scroll-animate text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -inset-4 bg-blue-100 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-100">
                <h3 className="text-2xl font-serif font-semibold mb-4 text-blue-900">Create Your Profile</h3>
                <p className="text-gray-600 leading-relaxed">
                  Showcase your skills, upload your portfolio, and set your availability for services or learning within the UNILORIN community
                </p>
              </div>
            </div>

            <div className="scroll-animate scroll-animate-delay-1 text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-800 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -inset-4 bg-teal-100 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-teal-100">
                <h3 className="text-2xl font-serif font-semibold mb-4 text-teal-800">Connect & Collaborate</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse services, contact fellow students via WhatsApp, and start working on your projects together
                </p>
              </div>
            </div>

            <div className="scroll-animate scroll-animate-delay-2 text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -inset-4 bg-orange-100 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-orange-100">
                <h3 className="text-2xl font-serif font-semibold mb-4 text-orange-800">Build Trust & Grow</h3>
                <p className="text-gray-600 leading-relaxed">
                  Rate experiences, earn verification badges, and build your reputation within the university community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety - Enhanced Design */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-teal-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="scroll-animate text-4xl md:text-5xl font-serif font-bold mb-8">
                Built for University of Ilorin Students
              </h2>
              <p className="scroll-animate text-xl text-blue-100 mb-12 leading-relaxed">
                TalentNest is designed specifically for the UNILORIN community, ensuring a safe, trusted environment
                where students can confidently share their skills and collaborate.
              </p>

              <div className="space-y-8">
                <div className="scroll-animate flex items-start space-x-6 group">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <Shield className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-orange-400">Verified Student Community</h3>
                    <p className="text-blue-100 leading-relaxed">
                      All users are verified University of Ilorin students, creating a trusted network of peers
                    </p>
                  </div>
                </div>

                <div className="scroll-animate scroll-animate-delay-1 flex items-start space-x-6 group">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <Star className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-orange-400">Rating & Review System</h3>
                    <p className="text-blue-100 leading-relaxed">
                      Build trust through transparent ratings and reviews from fellow UNILORIN students
                    </p>
                  </div>
                </div>

                <div className="scroll-animate scroll-animate-delay-2 flex items-start space-x-6 group">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <MessageCircle className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-orange-400">Direct Communication</h3>
                    <p className="text-blue-100 leading-relaxed">
                      Connect instantly via WhatsApp for quick project discussions and bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-animate relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-blue-400/20 rounded-3xl blur-xl"></div>
              <div className="relative rounded-2xl shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm p-8 h-96 flex items-center justify-center">
                <div className="text-center text-white/80">
                  <Users className="w-24 h-24 mx-auto mb-4 text-orange-400" />
                  <h3 className="text-2xl font-semibold mb-2">University Students</h3>
                  <p>Collaborating on Creative Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - University Themed */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="scroll-animate text-4xl md:text-5xl font-serif font-bold text-blue-900 mb-8">
              Ready to Join the UNILORIN TalentNest Community?
            </h2>
            <p className="scroll-animate text-xl text-gray-600 mb-12 leading-relaxed">
              Whether you&apos;re looking to showcase your skills or find talented University of Ilorin students for your projects, 
              TalentNest is your gateway to our vibrant university creative community.
            </p>
            
            <div className="scroll-animate flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-12 py-4 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Create Your Profile
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-12 py-4 border-2 border-teal-700 text-teal-800 hover:bg-teal-700 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                  Sign In to Browse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}