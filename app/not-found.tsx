import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ShoppingBag } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <div className="relative">
              <h1 className="text-8xl sm:text-9xl font-bold text-blue-600 dark:text-blue-400 opacity-20">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                    Page Not Found
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved to a new location.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              {...({ size: "lg" } as any)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Go Home</span>
              </Link>
            </Button>
            <Button 
              asChild
              {...({ variant: "outline", size: "lg" } as any)}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-105"
            >
              <Link href="/marketplace" className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Browse Marketplace</span>
              </Link>
            </Button>
          </div>
          
          <div className="pt-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Need help? <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
