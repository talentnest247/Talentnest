import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "TalentNest - UNILORIN Skills & Learning Platform",
  description: "Connect with skilled students and learn new skills at University of Ilorin community platform - TalentNest",
  generator: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans bg-background text-foreground">
  <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
  </ThemeProvider>
      </body>
    </html>
  )
}
