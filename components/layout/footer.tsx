import Link from "next/link"
import Image from "next/image"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  ExternalLink,
  Linkedin,
  Youtube
} from "lucide-react"

export function Footer() {
      const footerLinks = {
    platform: [
      { name: "Services", href: "/services" },
      { name: "Services Home", href: "/services" },
      { name: "Service Providers", href: "/services" },
      { name: "Dashboard", href: "/dashboard" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Documentation", href: "/docs" },
      { name: "Community", href: "/community" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Partners", href: "/partners" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Code of Conduct", href: "/conduct" },
    ]
  }

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook, color: "hover:text-blue-600" },
    { name: "Twitter", href: "#", icon: Twitter, color: "hover:text-sky-500" },
    { name: "Instagram", href: "#", icon: Instagram, color: "hover:text-pink-600" },
    { name: "LinkedIn", href: "#", icon: Linkedin, color: "hover:text-blue-700" },
    { name: "YouTube", href: "#", icon: Youtube, color: "hover:text-red-600" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-md opacity-40"></div>
                  <Image
                    src="/images/unilorin-logo.png"
                    alt="TalentNest"
                    width={48}
                    height={48}
                    className="relative rounded-full ring-2 ring-gray-700"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    TalentNest
                  </h3>
                  <p className="text-sm text-gray-400">UNILORIN Services Platform</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                Empowering the next generation of service providers through quality business opportunities, 
                expert connections, and a vibrant community of professionals.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">University of Ilorin, Kwara State, Nigeria</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">+234 (0) 803 XXX XXXX</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">hello@unilorin-talentnest.edu.ng</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`p-2 rounded-full bg-gray-800 backdrop-blur-sm border border-gray-700 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-lg hover:bg-gray-700`}
                  >
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Platform</h4>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-300 text-sm font-medium">
                  © 2025 TalentNest - UNILORIN Platform. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Built for University of Ilorin community
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <Link href="/status" className="hover:text-blue-400 transition-colors font-medium">
                  System Status
                </Link>
                <Link href="/api" className="hover:text-blue-400 transition-colors flex items-center font-medium">
                  API
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-400"></div>
                  <span className="font-medium">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
