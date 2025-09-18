import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; error_description?: string }
}) {
  const error = searchParams.error
  const errorDescription = searchParams.error_description

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="minimal" />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="border-border">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-serif">Authentication Error</CardTitle>
              <CardDescription>There was a problem with your authentication request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorDescription || error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/register">Try Signing Up Again</Link>
                </Button>

                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/login">Back to Sign In</Link>
                </Button>

                <Button variant="ghost" asChild className="w-full">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
