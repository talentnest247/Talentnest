import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="minimal" />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">TalentNest</h1>
            </Link>
            <p className="text-muted-foreground">Welcome back to your skills marketplace</p>
          </div>

          <Card className="border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your university email to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">University Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@university.edu"
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-secondary hover:text-secondary/80 underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-input border-border"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>

              <Separator />

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-secondary hover:text-secondary/80 underline font-medium">
                    Create your profile
                  </Link>
                </p>

                <div className="text-xs text-muted-foreground">
                  <p>By signing in, you agree to our</p>
                  <div className="flex justify-center space-x-4 mt-1">
                    <Link href="/terms" className="hover:text-primary underline">
                      Terms of Service
                    </Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:text-primary underline">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary underline">
              ← Back to TalentNest
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
