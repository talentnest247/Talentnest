"use client"

import StudentRegistrationForm from "@/components/auth/student-registration-form"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="minimal" />
      <div className="flex-1">
        <StudentRegistrationForm />
      </div>
      <Footer />
    </div>
  )
}
