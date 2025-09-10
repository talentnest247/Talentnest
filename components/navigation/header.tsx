"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Settings, LogOut, User, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface HeaderProps {
  variant?: "default" | "minimal"
  showAdminAccess?: boolean
}

interface UserProfile {
  id: string
  full_name: string
  is_admin?: boolean
}

export function Header({ variant = "default", showAdminAccess = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("id, full_name, is_admin")
          .eq("id", user.id)
          .single()

        if (profile) {
          setUserProfile(profile)
        }
      }

      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const navigationLinks = [
    { href: "/marketplace", label: "Browse Services" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#about", label: "About" },
  ]

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="w-12 h-12 mr-3 group-hover:opacity-80 transition-opacity relative">
                <Image 
                  src="/unilorin-logo.png" 
                  alt="University of Ilorin Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  TalentNest
                </h1>
                <span className="text-xs text-muted-foreground font-medium">
                  University of Ilorin
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {variant === "default" && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-secondary/5"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-muted rounded-full" />
            ) : user && userProfile ? (
              <>
                {(showAdminAccess || userProfile.is_admin) && (
                  <Link href="/admin" className="hidden sm:inline-block">
                    <Button variant="outline" size="sm" className="border-2 hover:bg-secondary/5 bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{getInitials(userProfile.full_name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{userProfile.full_name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/bookings" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-block">
                  <Button variant="ghost" className="hover:bg-secondary/5">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="font-semibold shadow-md hover:shadow-lg transition-all">Get Started</Button>
                </Link>
              </>
            )}

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
                    <Link href="/" className="text-lg font-bold text-foreground mb-4">
                      TalentNest
                    </Link>
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-4 border-t">
                      {user && userProfile ? (
                        <>
                          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium">{userProfile.full_name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          {(showAdminAccess || userProfile.is_admin) && (
                            <Link href="/admin" className="block mb-2">
                              <Button variant="outline" className="w-full justify-start bg-transparent">
                                <Settings className="h-4 w-4 mr-2" />
                                Admin Panel
                              </Button>
                            </Link>
                          )}
                          <Link href="/dashboard" className="block mb-2">
                            <Button variant="ghost" className="w-full justify-start">
                              <User className="h-4 w-4 mr-2" />
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/dashboard/bookings" className="block mb-2">
                            <Button variant="ghost" className="w-full justify-start">
                              <Calendar className="h-4 w-4 mr-2" />
                              My Bookings
                            </Button>
                          </Link>
                          <Button
                            onClick={handleSignOut}
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" className="block mb-2">
                            <Button variant="ghost" className="w-full justify-start">
                              Sign In
                            </Button>
                          </Link>
                          <Link href="/signup">
                            <Button className="w-full">Get Started</Button>
                          </Link>
                        </>
                      )}
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
