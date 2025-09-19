"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { 
  Menu, 
  User, 
  LogOut, 
  BookOpen, 
  Home, 
  Settings, 
  ShoppingBag,
  Award,
  MessageCircle
} from "lucide-react"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Skills", href: "/skills" },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image src="/placeholder-logo.svg" alt="UNILORIN Logo" width={40} height={40} className="rounded-full" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900">UNILORIN</span>
                <span className="text-xs text-slate-600 font-medium leading-tight">TalentNest</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${pathname === item.href ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'}`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
              {/* Teach a Skill as a separate button */}
              <Link
                href="/skills/add"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm border border-orange-400"
              >
                Teach a Skill
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" onClick={() => router.push("/login")} className="text-slate-700 hover:text-emerald-600 hover:bg-slate-100">Sign In</Button>
                  <Button onClick={() => router.push("/register")} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-500">Get Started</Button>
                </>
              ) : (
                // Desktop-only avatar dropdown. Mobile still uses the sheet menu above.
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button aria-label="Open user menu" className="h-10 w-10 rounded-full overflow-hidden focus:outline-none ring-2 ring-transparent hover:ring-emerald-200 transition-all duration-200">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-user.jpg" alt={user ? user.fullName : "User"} />
                          <AvatarFallback className="bg-slate-400 text-white font-semibold text-sm">{user ? user.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 mt-2 p-2 bg-white border border-slate-200 shadow-xl rounded-lg" align="end" sideOffset={8}>
                      <div className="px-3 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt={user ? user.fullName : "User"} />
                            <AvatarFallback className="bg-slate-400 text-white font-semibold text-sm">{user ? user.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user ? user.fullName : "User"}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors">
                            <User className="h-4 w-4 mr-3 text-emerald-600" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors">
                            <Award className="h-4 w-4 mr-3 text-emerald-600" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="flex items-center px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors">
                            <Settings className="h-4 w-4 mr-3 text-emerald-600" />
                            Account Settings
                          </Link>
                        </DropdownMenuItem>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <DropdownMenuItem onClick={logout} className="flex items-center px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 hover:text-red-800 rounded-md cursor-pointer transition-colors">
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {/* Mobile Navigation Trigger - only show on mobile */}
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-700 hover:text-emerald-600 hover:bg-slate-100">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-80 bg-white border-l border-gray-200">
                    <SheetHeader>
                      <SheetTitle className="text-left">
                        <div className="flex items-center gap-3">
                          <Image src="/placeholder-logo.svg" alt="UNILORIN" width={32} height={32} className="rounded-full" />
                          <div>
                            <h2 className="text-lg font-bold text-emerald-700">UNILORIN</h2>
                            <p className="text-xs text-slate-600">Student Artisan Hub</p>
                          </div>
                        </div>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 space-y-6">
                      <nav className="space-y-2">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${isActive(item.href) ? 'text-emerald-700 bg-slate-100 border border-emerald-200' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'}`}
                          >
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </nav>
                      {isAuthenticated ? (
                        <div className="space-y-4 pt-6 border-t border-gray-200/50">
                          <div className="flex items-center gap-3 px-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/placeholder-user.jpg" alt={user ? user.fullName : "User"} />
                              <AvatarFallback className="bg-slate-400 text-white">{user ? user.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{user ? user.fullName : "User"}</p>
                              <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                          </div>
                          <nav className="space-y-1">
                            <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-900 font-semibold hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors duration-200"><User className="h-5 w-5 text-emerald-600" /><span>View Profile</span></Link>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-900 font-semibold hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors duration-200"><Award className="h-5 w-5 text-emerald-600" /><span>Dashboard</span></Link>
                            <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-900 font-semibold hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors duration-200"><Settings className="h-5 w-5 text-emerald-600" /><span>Account Settings</span></Link>
                            <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-700 font-semibold hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"><LogOut className="h-5 w-5" /><span>Log out</span></button>
                          </nav>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-6 border-t border-gray-200/50">
                          <Button variant="outline" onClick={() => { router.push("/login"); setIsOpen(false); }} className="w-full justify-start text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-emerald-600"><User className="h-4 w-4 mr-2" />Sign in</Button>
                          <Button onClick={() => { router.push("/register"); setIsOpen(false); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-500">Get started</Button>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-16"></div>
    </>
  )
}
