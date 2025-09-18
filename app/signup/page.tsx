import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { UserCheck, Users } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Join TalentNest
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose your account type to get started
            </p>
          </div>
          
          <div className="space-y-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/register/student">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                  <CardTitle>Student Account</CardTitle>
                  <CardDescription>
                    Find skilled artisans for your projects and needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Register as Student
                  </Button>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/register/artisan">
                <CardHeader className="text-center">
                  <UserCheck className="h-12 w-12 mx-auto text-primary mb-2" />
                  <CardTitle>Artisan Account</CardTitle>
                  <CardDescription>
                    Showcase your skills and connect with students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Register as Artisan
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}