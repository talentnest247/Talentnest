import { StudentRegisterForm } from '@/components/auth/student-register-form'

export default function StudentRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Student Account</h1>
          <p className="text-gray-600 mt-2">Join the TalentNest community as a student</p>
        </div>
        <StudentRegisterForm />
      </div>
    </div>
  )
}