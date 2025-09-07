import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Shield, MessageCircle, Search, BookOpen } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6 text-balance">
            Your University Skills Marketplace
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Connect with talented students, showcase your skills, and build your portfolio. The trusted platform where
            university students offer and discover professional services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Start Showcasing Your Skills
              </Button>
            </Link>
            <Link href="#services">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Browse Student Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Discover Amazing Student Talent
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From digital design to artisan crafts, find skilled students ready to help with your projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="font-serif">Digital Services</CardTitle>
                <CardDescription>
                  Web development, graphic design, content creation, and more digital skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Web Design</Badge>
                  <Badge variant="secondary">Photography</Badge>
                  <Badge variant="secondary">Writing</Badge>
                  <Badge variant="secondary">Coding</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="font-serif">Artisan Crafts</CardTitle>
                <CardDescription>Handmade items, tailoring, jewelry making, and traditional crafts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Tailoring</Badge>
                  <Badge variant="secondary">Jewelry</Badge>
                  <Badge variant="secondary">Art</Badge>
                  <Badge variant="secondary">Crafts</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="font-serif">Learning & Tutoring</CardTitle>
                <CardDescription>Peer-to-peer learning, skill workshops, and academic tutoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Tutoring</Badge>
                  <Badge variant="secondary">Workshops</Badge>
                  <Badge variant="secondary">Mentoring</Badge>
                  <Badge variant="secondary">Training</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">How TalentNest Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to connect, collaborate, and grow within your university community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary-foreground">1</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Showcase your skills, upload your portfolio, and set your availability for services or learning
              </p>
            </div>

            <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary-foreground">2</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Connect & Collaborate</h3>
              <p className="text-muted-foreground">
                Browse services, contact providers via WhatsApp, and start working on your projects together
              </p>
            </div>

            <div className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary-foreground">3</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Build Trust & Grow</h3>
              <p className="text-muted-foreground">
                Rate experiences, earn verification badges, and build your reputation within the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 bg-card" >
      
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                Built for University Students
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                TalentNest is designed specifically for the university community, ensuring a safe, trusted environment
                where students can confidently share their skills and collaborate.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Verified Student Community</h3>
                    <p className="text-muted-foreground">
                      All users are verified university students, creating a trusted network of peers
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Star className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Rating & Review System</h3>
                    <p className="text-muted-foreground">
                      Build trust through transparent ratings and reviews from fellow students
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MessageCircle className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Direct Communication</h3>
                    <p className="text-muted-foreground">
                      Connect instantly via WhatsApp for quick project discussions and bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/university-students-collaborating-on-creative-proj.jpg"
                alt="Students collaborating on projects"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      <section className="py-20" >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Ready to Join TalentNest?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're looking to showcase your skills or find talented students for your projects, TalentNest is
            your gateway to the university creative community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Create Your Profile
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Sign In to Browse
              </Button>
            </Link>
          </div>
        </div>
      </section >

      {/* Footer */}
      < Footer />
    </div >
  )
}
