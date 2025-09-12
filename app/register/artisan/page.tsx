import { ArtisanRegisterForm } from '@/components/auth/artisan-register-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ArtisanRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/register" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to registration options
            </Link>
          </Button>
        </div>
        
        <div className="flex justify-center">
          <ArtisanRegisterForm />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Want to register as a student instead?{' '}
            <Link href="/register/student" className="text-blue-600 hover:text-blue-800 font-medium">
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
