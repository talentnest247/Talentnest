import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle, FileText, Users, Search } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find quick answers and get the help you need
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Quick Help Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <HelpCircle className="h-8 w-8 mb-2 text-blue-600" />
                <CardTitle className="text-lg">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  New to the platform? Learn the basics.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/docs#getting-started">View Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-green-600" />
                <CardTitle className="text-lg">Account & Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage your account and profile settings.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">Go to Settings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-purple-600" />
                <CardTitle className="text-lg">Skills & Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Find skills, enroll, and track progress.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/skills">Browse Skills</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Popular Topics */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="login-issues">
                <AccordionTrigger>I'm having trouble logging in</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      If you're having trouble logging in, try these solutions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Make sure you're using the correct email and password</li>
                      <li>Check if your account is verified</li>
                      <li>Try resetting your password</li>
                      <li>Clear your browser cache and cookies</li>
                      <li>Contact support if the problem persists</li>
                    </ul>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="enrollment">
                <AccordionTrigger>How do I enroll in a skill?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Enrolling in a skill is easy:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Browse skills on the Skills page</li>
                      <li>Click on a skill you're interested in</li>
                      <li>Review the details and click "Enroll Now"</li>
                      <li>Complete the payment process</li>
                      <li>Access the skill from your Dashboard</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="verification">
                <AccordionTrigger>How do I get verified as an artisan?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      To get verified as an artisan:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Complete your profile with detailed information</li>
                      <li>Upload proof of your skills and experience</li>
                      <li>Submit identification documents</li>
                      <li>Wait for admin review (2-3 business days)</li>
                      <li>You'll receive a notification once verified</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment">
                <AccordionTrigger>Payment and refund questions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      <strong>Payment Methods:</strong> We accept bank transfers, card payments, and mobile money.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Refunds:</strong> Available within 7 days of enrollment if unsatisfied.
                      Contact support to initiate a refund.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Processing:</strong> Payments are processed securely through verified gateways.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="technical">
                <AccordionTrigger>Technical issues and troubleshooting</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Common technical issues and solutions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Page not loading: Try refreshing or clearing cache</li>
                      <li>Slow performance: Check your internet connection</li>
                      <li>Mobile issues: Ensure you're using a supported browser</li>
                      <li>Video not playing: Check your browser's video settings</li>
                    </ul>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/contact">Report Issue</Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact Options */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Still Need Help?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Chat with our support team in real-time.
                  </p>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <CardTitle className="text-lg">Contact Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Send us a detailed message about your issue.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">Support Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 8:00 AM - 6:00 PM WAT<br />
                Saturday: 9:00 AM - 4:00 PM WAT<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
