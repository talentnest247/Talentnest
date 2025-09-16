import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Users, BookOpen, Star, GraduationCap, Award, Zap, Shield, MessageCircle } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-unilorin-gradient-light relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in hover-lift">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Trusted by 500+ UNILORIN Students
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-balance leading-tight animate-slide-up">
            <span className="text-unilorin-gradient">University of Ilorin</span>
            <span className="text-secondary block animate-bounce-gentle">Skills Marketplace</span>
          </h1>

          <p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto text-pretty leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Connect with talented UNILORIN students, showcase your skills, and build your portfolio. The trusted
            platform where University of Ilorin students offer and discover professional services within our campus
            community.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in"
            style={{ animationDelay: "0.6s" }}
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-10 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transition-all hover-lift bg-unilorin-gradient hover:bg-unilorin-gradient"
              >
                <Award className="w-5 h-5 mr-2" />
                Start Showcasing Your Skills
              </Button>
            </Link>
            <Link href="#services">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-4 h-auto font-semibold border-2 border-primary hover:bg-primary/5 bg-transparent hover-lift"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Student Services
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-8 border-t border-border/50">
            <div className="text-center animate-fade-in hover-lift" style={{ animationDelay: "0.9s" }}>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center animate-fade-in hover-lift" style={{ animationDelay: "1.1s" }}>
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">Services Listed</div>
            </div>
            <div className="text-center animate-fade-in hover-lift" style={{ animationDelay: "1.3s" }}>
              <div className="text-3xl font-bold text-secondary">4.8★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4 mr-2" />
              Popular Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
              Discover Amazing <span className="text-unilorin-gradient">UNILORIN</span> Student Talent
            </h2>
            <p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              From digital design to artisan crafts, find skilled University of Ilorin students ready to help with your
              projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              className="border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 group hover-lift animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors group-hover:animate-pulse">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold mb-3 text-primary">Digital Services</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Web development, graphic design, content creation, and more digital skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Web Design
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Photography
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Writing
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Coding
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 group hover-lift animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors group-hover:animate-pulse">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold mb-3 text-primary">Artisan Crafts</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Handmade items, tailoring, jewelry making, and traditional crafts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Tailoring
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Jewelry
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Art
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Crafts
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 group hover-lift animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors group-hover:animate-pulse">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold mb-3 text-primary">Learning & Tutoring</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Peer-to-peer learning, skill workshops, and academic tutoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Tutoring
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Workshops
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Mentoring
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 hover-lift">
                    Training
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6 animate-fade-in">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">How TalentNest Works</h2>
            <p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Simple steps to connect, collaborate, and grow within the University of Ilorin community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-unilorin-gradient rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all hover-lift animate-glow">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/20 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Register with Your Matric Number</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Sign up using your UNILORIN matric number, showcase your skills, and set your availability for services
              </p>
            </div>

            <div className="text-center group animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative mb-8">
                <div
                  className="w-20 h-20 bg-unilorin-gradient rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all hover-lift animate-glow"
                  style={{ animationDelay: "0.5s" }}
                >
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/20 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Connect & Collaborate</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Browse services, contact providers via WhatsApp, and start working on your projects together
              </p>
            </div>

            <div className="text-center group animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="relative mb-8">
                <div
                  className="w-20 h-20 bg-unilorin-gradient rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all hover-lift animate-glow"
                  style={{ animationDelay: "1s" }}
                >
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Build Trust & Grow</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Rate experiences, earn verification badges, and build your reputation within the UNILORIN community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Trusted & Secure
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Built for <span className="text-unilorin-gradient">University of Ilorin</span> Students
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                TalentNest is designed specifically for the UNILORIN community, ensuring a safe, trusted environment
                where students can confidently share their skills and collaborate within our campus.
              </p>

              <div className="space-y-8">
                <div
                  className="flex items-start space-x-6 hover-lift animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-primary">Verified UNILORIN Student Community</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      All users are verified University of Ilorin students using their matric number
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-6 hover-lift animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-primary">Rating & Review System</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Build trust through transparent ratings and reviews from fellow students
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-6 hover-lift animate-fade-in"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-primary">Direct Communication</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Connect instantly via WhatsApp for quick project discussions and bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift">
                <Image
                  src="/university-of-ilorin-students-collaborating-on-cre.jpg"
                  alt="UNILORIN students collaborating on projects"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-unilorin-gradient-light"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/10 rounded-2xl animate-float"></div>
              <div
                className="absolute -top-6 -right-6 w-16 h-16 bg-primary/20 rounded-xl animate-float"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-unilorin-gradient-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-8 animate-fade-in">
              <GraduationCap className="w-4 h-4 mr-2" />
              Join the Community
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-slide-up">
              Ready to Join <span className="text-unilorin-gradient">TalentNest</span>?
            </h2>
            <p
              className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Whether you&apos;re looking to showcase your skills or find talented UNILORIN students for your projects,
              TalentNest is your gateway to the University of Ilorin creative community.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in"
              style={{ animationDelay: "0.6s" }}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-lg px-10 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transition-all hover-lift bg-unilorin-gradient hover:bg-unilorin-gradient"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Create Your Profile
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-10 py-4 h-auto font-semibold border-2 border-primary hover:bg-primary/5 bg-transparent hover-lift"
                >
                  <Users className="w-5 h-5 mr-2" />
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
