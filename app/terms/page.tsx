import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Last updated: August 29, 2025
            </p>
            <Badge variant="outline">Effective Date: September 1, 2025</Badge>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Welcome to the UNILORIN Artisan Platform. These Terms of Service ("Terms") govern your use of our
                  platform and services. By accessing or using our platform, you agree to be bound by these Terms.
                </p>
                <p>
                  If you do not agree to these Terms, please do not use our platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  The UNILORIN Artisan Platform is an online marketplace that connects students of the University of Ilorin
                  with skilled artisans for learning opportunities and services. Our platform includes:
                </p>
                <ul>
                  <li>Skill learning and enrollment system</li>
                  <li>Artisan verification and profile management</li>
                  <li>Communication tools between students and artisans</li>
                  <li>Payment processing for services</li>
                  <li>Review and rating system</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h4>Students</h4>
                <ul>
                  <li>Current students of the University of Ilorin</li>
                  <li>Valid student ID required</li>
                  <li>Minimum age of 18 years</li>
                </ul>

                <h4>Artisans</h4>
                <ul>
                  <li>Demonstrated expertise in their field</li>
                  <li>Commitment to quality service delivery</li>
                  <li>Minimum age of 18 years</li>
                  <li>Successful completion of verification process</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>You are responsible for:</p>
                <ul>
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and up-to-date information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. User Conduct</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>You agree not to:</p>
                <ul>
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Post false, misleading, or inappropriate content</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the platform</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Content and Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h4>User Content</h4>
                <ul>
                  <li>You retain ownership of content you post</li>
                  <li>You grant us a license to use, display, and distribute your content</li>
                  <li>You are responsible for ensuring you have rights to post your content</li>
                </ul>

                <h4>Platform Content</h4>
                <ul>
                  <li>All platform content is owned by us or our licensors</li>
                  <li>You may not copy, modify, or distribute platform content without permission</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Payments and Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h4>Payments</h4>
                <ul>
                  <li>All fees are displayed in Nigerian Naira</li>
                  <li>Payments are processed securely through approved payment gateways</li>
                  <li>You agree to pay all applicable fees for services</li>
                </ul>

                <h4>Refunds</h4>
                <ul>
                  <li>Refund eligibility depends on the specific service and circumstances</li>
                  <li>Requests must be made within 7 days of service completion</li>
                  <li>Approved refunds are processed within 5-10 business days</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Disclaimers and Limitations</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  The platform is provided "as is" without warranties of any kind. We do not guarantee:
                </p>
                <ul>
                  <li>Continuous, uninterrupted access to the platform</li>
                  <li>The accuracy or completeness of information provided by artisans</li>
                  <li>The quality of services provided by artisans</li>
                  <li>That the platform will meet your specific requirements</li>
                </ul>
                <p>
                  Our liability is limited to the maximum extent permitted by law.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  We may terminate or suspend your account and access to the platform immediately,
                  without prior notice, for any reason, including breach of these Terms.
                </p>
                <p>
                  Upon termination, your right to use the platform ceases immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  These Terms are governed by and construed in accordance with the laws of Nigeria.
                  Any disputes arising from these Terms shall be subject to the exclusive jurisdiction
                  of the courts of Nigeria.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  We reserve the right to modify these Terms at any time. Changes will be effective
                  immediately upon posting on the platform. Your continued use of the platform
                  constitutes acceptance of the modified Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul>
                  <li>Email: legal@unilorinartisan.com</li>
                  <li>Phone: +234 (0) 800 ARTISAN</li>
                  <li>Address: University of Ilorin, PMB 1515, Ilorin, Kwara State, Nigeria</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
