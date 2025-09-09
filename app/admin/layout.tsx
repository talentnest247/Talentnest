import type React from "react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showAdminAccess={true} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
