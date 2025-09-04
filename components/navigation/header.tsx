"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface HeaderProps {
  variant?: "default" | "minimal"
}

export function Header({ variant = "default" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigationLinks = [
    { href: "#services", label: "Browse Services" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#about", label: "About" },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-serif font-bold text-primary">TalentNest</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {variant === "default" && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:inline-block">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>

            {/* Mobile Menu */}
            {variant === "default" && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link href="/" className="text-lg font-serif font-bold text-primary mb-4">
                      TalentNest
                    </Link>
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-4 border-t">
                      <Link href="/login" className="block mb-2">
                        <Button variant="ghost" className="w-full justify-start">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
