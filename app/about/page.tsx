import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Award, Target, Heart, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About TalentNest Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Empowering students and service providers at the University of Ilorin through service marketing,
              professional connections, and a thriving services ecosystem.
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Since 2024
            </Badge>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-blue-800">Our Mission</h2>
              <p className="text-lg text-blue-600 max-w-2xl mx-auto">
                To create a vibrant ecosystem where University of Ilorin students can find quality services
                from verified providers while providing service providers with opportunities to grow their businesses
                and market their expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <CardTitle>Service Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">
                    Bridge the gap between academic life and professional services through
                    quality service connections.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <CardTitle>Community Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">
                    Foster a supportive community where students and service providers can connect,
                    collaborate, and grow together.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Award className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <CardTitle>Entrepreneurship</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">
                    Empower providers to turn their services into sustainable businesses and
                    create economic opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-blue-800">Our Values</h2>
              <p className="text-lg text-blue-600">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <Target className="h-8 w-8 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 text-blue-800">Excellence</h3>
                  <p className="text-blue-700">
                    We strive for the highest quality in education, services, and user experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Heart className="h-8 w-8 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 text-blue-800">Inclusivity</h3>
                  <p className="text-blue-700">
                    Everyone deserves access to quality education and economic opportunities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Lightbulb className="h-8 w-8 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 text-blue-800">Innovation</h3>
                  <p className="text-blue-700">
                    We embrace new ideas and technologies to improve our platform and services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-blue-800">Our Impact</h2>
              <p className="text-lg text-blue-600">
                Growing together, one service at a time
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-muted-foreground">Students Enrolled</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
                <p className="text-muted-foreground">Service Providers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <p className="text-muted-foreground">Services Offered</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
                <p className="text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you&apos;re a student looking to find professional services or a provider ready to market your expertise,
              there&apos;s a place for you in our growing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
