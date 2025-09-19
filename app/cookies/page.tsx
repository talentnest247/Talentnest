import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Last updated: August 29, 2025
            </p>
            <Badge variant="outline">Effective Date: September 1, 2025</Badge>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. What Are Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Cookies are small text files that are stored on your device when you visit our website.
                  They help us provide you with a better browsing experience by remembering your preferences
                  and understanding how you use our platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>We use cookies for the following purposes:</p>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
                  <li><strong>Authentication:</strong> Keep you logged in during your session</li>
                  <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
                  <li><strong>Analytics:</strong> Understand how users interact with our platform</li>
                  <li><strong>Preferences:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing:</strong> Show relevant advertisements and promotions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h4>Session Cookies</h4>
                <p>Temporary cookies that expire when you close your browser.</p>

                <h4>Persistent Cookies</h4>
                <p>Cookies that remain on your device for a set period or until you delete them.</p>

                <h4>First-party Cookies</h4>
                <p>Cookies set directly by our website.</p>

                <h4>Third-party Cookies</h4>
                <p>Cookies set by third-party services we use (analytics, payment processing, etc.).</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Specific Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Cookie Name</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Purpose</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">auth-token</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">User authentication</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">Session</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">theme</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">Theme preference</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">_ga</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">Google Analytics</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">cart</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">Shopping cart contents</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-2">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Managing Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>You can control and manage cookies in several ways:</p>

                <h4>Browser Settings</h4>
                <ul>
                  <li>Most browsers allow you to block or delete cookies</li>
                  <li>You can set your browser to notify you when cookies are placed</li>
                  <li>Check your browser's help section for specific instructions</li>
                </ul>

                <h4>Our Cookie Preferences</h4>
                <p>
                  You can manage your cookie preferences through our cookie consent banner
                  or by contacting us directly.
                </p>

                <h4>Third-party Tools</h4>
                <p>
                  Various third-party tools are available to help you manage cookies across websites.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Impact of Disabling Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Disabling cookies may affect your experience on our platform:
                </p>
                <ul>
                  <li>You may need to log in each time you visit</li>
                  <li>Some features may not work properly</li>
                  <li>Your preferences may not be saved</li>
                  <li>Analytics and personalization features may be limited</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices
                  or for other operational, legal, or regulatory reasons. We will notify you of any material
                  changes by posting the updated policy on our website.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <ul>
                  <li>Email: privacy@unilorinartisan.com</li>
                  <li>Phone: +234 (0) 800 ARTISAN</li>
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
