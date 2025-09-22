import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Users, Settings, HelpCircle, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Documentation & Help Center
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Everything you need to know about using the TalentNest Platform.
              Get started, find services, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="#getting-started">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="#faq">Browse FAQ</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    New to the platform? Start here with our beginner&apos;s guide.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="#getting-started">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <CardTitle className="text-lg">For Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Learn how to find services, book providers, and leave reviews.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="#customers">View Guide</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Settings className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <CardTitle className="text-lg">For Service Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create your profile, list services, and manage your business.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="#providers">View Guide</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                  <CardTitle className="text-lg">FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Quick answers to commonly asked questions.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="#faq">Browse FAQ</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
              <p className="text-lg text-muted-foreground">
                Follow these simple steps to begin your journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-lg font-bold">1</Badge>
                    <CardTitle>Create Account</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Sign up as a student or artisan. Students need a valid UNILORIN email and ID.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Choose your role (Student/Artisan)</li>
                    <li>• Provide basic information</li>
                    <li>• Verify your email</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-lg font-bold">2</Badge>
                    <CardTitle>Complete Profile</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Set up your profile with relevant information and preferences.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Add profile picture</li>
                    <li>• Fill in personal details</li>
                    <li>• Set notification preferences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-lg font-bold">3</Badge>
                    <CardTitle>Start Exploring</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Browse services, connect with providers, and book what you need.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Explore the marketplace</li>
                    <li>• Book services</li>
                    <li>• Connect with providers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Customer Guide */}
        <section id="customers" className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Customer Guide</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know as a customer
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="finding-services">
                <AccordionTrigger>How do I find and book services?</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Navigate to the Services page from the main menu</li>
                    <li>Use filters to search by category, rating, or price</li>
                    <li>Click on a service card to view details</li>
                    <li>Click &quot;Book Now&quot; and complete the booking</li>
                    <li>Access your bookings from the Dashboard</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tracking-bookings">
                <AccordionTrigger>How do I track my bookings?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    Your booking dashboard provides comprehensive tracking:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>View booked services and completion status</li>
                    <li>Track service progress and timeline</li>
                    <li>Access service materials and updates</li>
                    <li>Leave reviews upon completion</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="communication">
                <AccordionTrigger>How do I communicate with service providers?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    Direct communication is available through our platform:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Use the messaging system in your dashboard</li>
                    <li>Contact providers directly from their profile</li>
                    <li>Schedule services and ask questions</li>
                    <li>Request updates on service progress</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Service Providers Guide */}
        <section id="providers" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Service Provider Guide</h2>
              <p className="text-lg text-muted-foreground">
                Build your business and market your services
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="verification">
                <AccordionTrigger>How do I get verified?</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Complete your provider profile with detailed information</li>
                    <li>Upload proof of your services and experience</li>
                    <li>Submit identification documents</li>
                    <li>Wait for admin review (usually 2-3 business days)</li>
                    <li>Receive verification badge upon approval</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="creating-services">
                <AccordionTrigger>How do I create and list services?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    Create compelling service listings to attract customers:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Go to &quot;Add Service&quot; from your dashboard</li>
                    <li>Provide detailed description and service features</li>
                    <li>Set appropriate pricing and delivery time</li>
                    <li>Upload portfolio images and sample work</li>
                    <li>Specify service requirements and target audience</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="managing-business">
                <AccordionTrigger>How do I manage my business?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">
                    Use your provider dashboard to manage all aspects:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Track bookings and customer progress</li>
                    <li>Manage your service listings and pricing</li>
                    <li>View earnings and payment history</li>
                    <li>Update availability and contact information</li>
                    <li>Respond to customer inquiries and reviews</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="payment-methods">
                <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    We accept various payment methods including bank transfers, card payments,
                    and mobile money. All transactions are processed securely through verified
                    payment gateways.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund-policy">
                <AccordionTrigger>What is the refund policy?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Refunds are available within 7 days of booking if you&apos;re not satisfied
                    with the service. Contact our support team to initiate a refund request.
                    Processing takes 5-10 business days.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="verification-time">
                <AccordionTrigger>How long does verification take?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Verification typically takes 2-3 business days. You&apos;ll receive an email
                    notification once your application is reviewed. Make sure all required
                    documents are submitted clearly.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="technical-support">
                <AccordionTrigger>How do I get technical support?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    For technical issues, contact our support team through the contact form
                    or email support@unilorinartisan.com. We&apos;re available Monday-Friday,
                    8 AM - 6 PM WAT.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              Contact us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/community">
                  <Users className="h-5 w-5 mr-2" />
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
