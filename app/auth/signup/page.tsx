'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthSignupRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Immediately redirect to the correct signup page
    router.replace('/register')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to signup...</p>
      </div>
    </div>
  )
}
