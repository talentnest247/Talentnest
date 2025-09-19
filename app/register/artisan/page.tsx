import { ArtisanRegisterForm } from '@/components/auth/artisan-register-form'
import Image from 'next/image'
import Link from 'next/link'

export default function ArtisanRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6 group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3 shadow-lg border-2 border-green-100 group-hover:scale-105 transition-all duration-300">
              <Image 
                src="/unilorin-logo.png" 
                alt="University of Ilorin" 
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                TalentNest
              </h1>
              <span className="text-xs text-gray-500 font-medium">UNILORIN Community</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join as Artisan</h2>
          <p className="text-gray-600">Showcase your skills and start earning from your talents</p>
        </div>
        <ArtisanRegisterForm />
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Looking for services? {' '}
            <Link href="/register/student" className="text-green-600 hover:text-green-700 font-medium underline">
              Register as Student
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}