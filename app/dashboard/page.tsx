"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { ArtisanDashboard } from "@/components/dashboard/artisan-dashboard"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {user.role === 'artisan' ? (
          <ArtisanDashboard user={user} />
        ) : (
          <StudentDashboard user={user} />
        )}
      </main>
      <Footer />
    </div>
  )
}
