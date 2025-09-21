"use client"
import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Content */}
        <div className="relative w-full max-w-md space-y-8 animate-in slide-in-from-bottom duration-1000">
          <div className="text-center">
            <Image
              src="/images/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              UNILORIN
            </h1>
            <p className="text-sm text-muted-foreground">Artisan Community Platform</p>
            <p className="text-xs text-muted-foreground mt-2">Sign in to your account</p>
          </div>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
