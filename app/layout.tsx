import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { Source_Sans_3 } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

export const metadata: Metadata = {
  title: "TalentNest - University of Ilorin Skills Marketplace",
  description:
    "Connect with talented UNILORIN students. Showcase your skills. Build your portfolio. The trusted marketplace for University of Ilorin services and collaborations.",
  generator: "v0.app",
  keywords:
    "University of Ilorin, UNILORIN, student services, skills marketplace, freelance, tutoring, academic writing, graphic design",
  authors: [{ name: "TalentNest Team" }],
  creator: "TalentNest",
  publisher: "TalentNest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://talentnest.vercel.app",
    title: "TalentNest - University of Ilorin Skills Marketplace",
    description:
      "Connect with talented UNILORIN students. Showcase your skills and find services within the University of Ilorin community.",
    siteName: "TalentNest",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentNest - University of Ilorin Skills Marketplace",
    description:
      "Connect with talented UNILORIN students. Showcase your skills and find services within the University of Ilorin community.",
  },
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading TalentNest...</p>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${sourceSans.variable} ${playfair.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
