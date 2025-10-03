"use client"
import { useState } from "react"
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
  Settings, 
  Award
} from "lucide-react"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white via-blue-50 to-white border-b border-blue-200 shadow-lg backdrop-blur-md transition-all duration-500 ease-in-out">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <Image 
                src="/images/unilorin-logo.png" 
                alt="UNILORIN Logo" 
                width={32} 
                height={32} 
                className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
              />
              <div className="flex flex-col">
                <span className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight">UniLorin Portal</span>
                <span className="hidden sm:block text-[10px] md:text-xs text-slate-600 font-medium leading-tight">University of Ilorin Services Platform</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${pathname === item.href ? 'text-blue-700 bg-blue-50' : 'text-blue-700 hover:text-blue-800 hover:bg-blue-50'}`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
              {/* Get Support button */}
              <Link
                href="/contact"
                className="px-3 xl:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs xl:text-sm font-medium transition-colors duration-200 shadow-sm border border-blue-500 whitespace-nowrap"
              >
                Get Support
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              {!isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => router.push("/login")} 
                    className="hidden sm:flex text-blue-700 hover:text-blue-800 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-3 md:px-4 h-8 sm:h-9 md:h-10"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => router.push("/register")} 
                    className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-500 text-xs md:text-sm px-2 md:px-4 h-8 md:h-10"
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/admin/login")} 
                    className="hidden sm:flex text-blue-700 border-blue-300 hover:bg-blue-50 text-[10px] sm:text-xs px-2 sm:px-3 h-7 sm:h-8 md:h-9"
                  >
                    Admin
                  </Button>
                </>
              ) : (
                // Desktop-only avatar dropdown. Mobile still uses the sheet menu above.
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button aria-label="Open user menu" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full overflow-hidden focus:outline-none ring-2 ring-transparent hover:ring-emerald-200 transition-all duration-200">
                        <Avatar className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
                          <AvatarImage src="/placeholder-user.jpg" alt={user ? user.fullName : "User"} />
                          <AvatarFallback className="bg-slate-400 text-white font-semibold text-xs sm:text-sm">{user ? user.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 md:w-64 mt-2 p-1.5 md:p-2 bg-white border border-slate-200 shadow-xl rounded-lg" align="end" sideOffset={8}>
                      <div className="px-2 md:px-3 py-2 md:py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 md:gap-3">
                          <Avatar className="h-8 w-8 md:h-10 md:w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt={user ? user.fullName : "User"} />
                            <AvatarFallback className="bg-slate-400 text-white font-semibold text-xs md:text-sm">{user ? user.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-slate-900 truncate">{user ? user.fullName : "User"}</p>
                            <p className="text-[10px] md:text-xs text-slate-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors">
                            <User className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3 text-blue-600" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="flex items-center px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors">
                            <Award className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3 text-blue-600" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="flex items-center px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-blue-900 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors">
                            <Settings className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3 text-blue-600" />
                            Account Settings
                          </Link>
                        </DropdownMenuItem>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <DropdownMenuItem onClick={logout} className="flex items-center px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-red-700 hover:bg-red-50 hover:text-red-800 rounded-md cursor-pointer transition-colors">
                          <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
                          Sign Out
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {/* Mobile Navigation Trigger - show on tablet and mobile */}
              <div className="lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-blue-700 hover:text-blue-800 hover:bg-blue-50">
                      <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[85vw] sm:w-80 bg-white border-l border-gray-200">
                    <SheetHeader>
                      <SheetTitle className="text-left">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Image 
                            src="/images/unilorin-logo.png" 
                            alt="UNILORIN" 
                            width={32} 
                            height={32} 
                            className="rounded-full w-7 h-7 sm:w-8 sm:h-8"
                          />
                          <div>
                            <h2 className="text-base sm:text-lg font-bold text-blue-700">UniLorin Portal</h2>
                            <p className="text-[10px] sm:text-xs text-slate-600">UNILORIN Services Platform</p>
                          </div>
                        </div>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                      <nav className="space-y-1 sm:space-y-2">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 ${isActive(item.href) ? 'text-blue-700 bg-blue-50 border border-blue-200' : 'text-blue-700 hover:text-blue-800 hover:bg-blue-50'}`}
                          >
                            <span>{item.name}</span>
                          </Link>
                        ))}
                        {/* Get Support in Mobile Menu */}
                        <Link
                          href="/contact"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                        >
                          <span>Get Support</span>
                        </Link>
                      </nav>
                      {isAuthenticated ? (
                        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200/50">
                          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
                            <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                              <AvatarImage src="/placeholder-user.jpg" alt={user ? user.fullName : "User"} />
                              <AvatarFallback className="bg-blue-400 text-white text-xs sm:text-sm">{user ? user.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{user ? user.fullName : "User"}</p>
                              <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.email}</p>
                            </div>
                          </div>
                          <nav className="space-y-0.5 sm:space-y-1">
                            <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-blue-900 font-semibold hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm sm:text-base"><User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" /><span>View Profile</span></Link>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-blue-900 font-semibold hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm sm:text-base"><Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" /><span>Dashboard</span></Link>
                            <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-blue-900 font-semibold hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm sm:text-base"><Settings className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" /><span>Account Settings</span></Link>
                            <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-red-700 font-semibold hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm sm:text-base"><LogOut className="h-4 w-4 sm:h-5 sm:w-5" /><span>Log out</span></button>
                          </nav>
                        </div>
                      ) : (
                        <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-gray-200/50">
                          <Button variant="outline" onClick={() => { router.push("/login"); setIsOpen(false); }} className="w-full justify-start text-blue-700 border-blue-300 hover:bg-blue-50 hover:text-blue-800 h-10 sm:h-11 text-sm sm:text-base"><User className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />Sign in</Button>
                          <Button onClick={() => { router.push("/register"); setIsOpen(false); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-500 h-10 sm:h-11 text-sm sm:text-base">Get started</Button>
                          <Button 
                            variant="outline" 
                            onClick={() => { router.push("/admin/login"); setIsOpen(false); }} 
                            className="w-full text-blue-700 border-blue-300 hover:bg-blue-50 h-9 sm:h-10 text-xs sm:text-sm"
                          >
                            Admin Login
                          </Button>
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

      {/* Header Spacer - Responsive height matching header */}
      <div className="h-14 sm:h-16"></div>
    </>
  )
}
