"use client"
import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
        
        {/* Content */}
        <div className="relative w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">UniLorin</span>
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
