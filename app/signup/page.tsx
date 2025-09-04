import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="minimal" />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">TalentNest</h1>
            </Link>
            <p className="text-muted-foreground">Join your university's skills marketplace</p>
          </div>

          <Card className="border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-center">Create Your Profile</CardTitle>
              <CardDescription className="text-center">
                Showcase your skills and connect with fellow students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" type="text" placeholder="Doe" className="bg-input border-border" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">University Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@university.edu"
                      className="bg-input border-border"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Use your official university email for verification</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select your university" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="university-of-lagos">University of Lagos</SelectItem>
                        <SelectItem value="obafemi-awolowo">Obafemi Awolowo University</SelectItem>
                        <SelectItem value="university-of-ibadan">University of Ibadan</SelectItem>
                        <SelectItem value="ahmadu-bello">Ahmadu Bello University</SelectItem>
                        <SelectItem value="covenant-university">Covenant University</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="Your student ID number"
                      className="bg-input border-border"
                      required
                    />
                  </div>
                </div>

                <Separator />

                {/* Account Setup */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Account Setup</h3>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      className="bg-input border-border"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="bg-input border-border"
                      required
                    />
                  </div>
                </div>

                <Separator />

                {/* Profile Setup */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Profile Setup</h3>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">I want to:</Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Choose your primary goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offer-services">Offer my skills and services</SelectItem>
                        <SelectItem value="find-services">Find talented students for projects</SelectItem>
                        <SelectItem value="both">Both offer and find services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Your Skills (Optional)</Label>
                    <Textarea
                      id="skills"
                      placeholder="e.g., Web Development, Graphic Design, Photography, Writing, Tutoring..."
                      className="bg-input border-border min-h-[80px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      List your skills to help others find you. You can add more details later.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Brief Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell others about yourself and what you're passionate about..."
                      className="bg-input border-border min-h-[80px]"
                    />
                  </div>
                </div>

                <Separator />

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" className="mt-1" />
                    <div className="text-sm">
                      <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-secondary hover:text-secondary/80 underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-secondary hover:text-secondary/80 underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="updates" className="mt-1" />
                    <Label htmlFor="updates" className="text-sm font-normal cursor-pointer">
                      I'd like to receive updates about new features and community highlights
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Create My TalentNest Profile
                </Button>
              </form>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-secondary hover:text-secondary/80 underline font-medium">
                    Sign in here
                  </Link>
                </p>
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
