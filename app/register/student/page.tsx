import { StudentRegisterForm } from '@/components/auth/student-register-form'
import Image from 'next/image'
import Link from 'next/link'

export default function StudentRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6 group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3 shadow-lg border-2 border-blue-100 group-hover:scale-105 transition-all duration-300">
              <Image 
                src="/unilorin-logo.png" 
                alt="University of Ilorin" 
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                TalentNest
              </h1>
              <span className="text-xs text-gray-500 font-medium">UNILORIN Community</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join as Student</h2>
          <p className="text-gray-600">Discover amazing services from talented UNILORIN students</p>
        </div>
        <StudentRegisterForm />
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Want to offer services? {' '}
            <Link href="/register/artisan" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Register as Artisan
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}