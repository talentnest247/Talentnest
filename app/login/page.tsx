"use client"
import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push("/")
  }

  // Development helper to clear cached sessions
  const clearSession = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      // Clear any client-side storage
      localStorage.clear()
      sessionStorage.clear()
      // Force page reload to clear any cached state
      window.location.reload()
    } catch (error) {
      console.error('Error clearing session:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
        
        {/* Development Helper - Clear Session Button */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={clearSession}
            className="absolute bottom-6 right-6 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors shadow-lg z-10"
          >
            Clear Session
          </button>
        )}
        
        {/* Content */}
        <div className="relative w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Image 
                src="/images/unilorin-logo.png" 
                alt="University of Ilorin Logo" 
                width={80}
                height={80}
                className="w-full h-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              UniLorin Portal
            </h1>
            <p className="text-blue-700 font-medium">University of Ilorin Services Platform</p>
            <p className="text-blue-600 mt-2">Sign in to your account</p>
          </div>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
