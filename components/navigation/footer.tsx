import Link from "next/link"
import { Globe, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  const categories = [
    "Web Development",
    "Graphic Design", 
    "Photography",
    "Coding",
    "Tailoring",
    "Jewelry",
    "Art",
    "Crafts",
    "Tutoring",
    "Workshops",
    "Mentoring",
    "Training",
  ]

  const aboutLinks = [
    { href: "/careers", label: "Careers" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ]

  const supportLinks = [
    { href: "/help", label: "Help" },
    { href: "/support", label: "Support" },
  ]

  const communityLinks = [
    { href: "/success-stories", label: "Testimonies" },
    { href: "/community", label: "Community Hub" },
    { href: "/forum", label: "Forum" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
  ]

  const moreLinks = [
    { href: "/learn", label: "Learn" },
  ]

  const socialLinks = [
    { href: "https://facebook.com/", icon: Facebook, label: "Facebook" },
    { href: "https://twitter.com/", icon: Twitter, label: "Twitter" },
    { href: "https://instagram.com/", icon: Instagram, label: "Instagram" },
    { href: "https://linkedin.com/", icon: Linkedin, label: "LinkedIn" },
    { href: "https://youtube.com/", icon: Youtube, label: "Youtube" },
  ]

  return (
    <footer className="bg-gradient-to-br from-blue-50 via-white to-teal-50 border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <div className="py-12 border-b border-blue-100">
          <h3 className="text-2xl font-serif font-bold text-blue-900 mb-8 text-center">Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/`}
                className="text-gray-700 hover:text-blue-800 text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 p-2 rounded-lg hover:bg-blue-50"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {/* About */}
            <div className="space-y-1">
              <h4 className="text-lg font-serif font-bold text-blue-900 mb-6">About</h4>
              <ul className="space-y-4">
                {aboutLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-teal-700 text-sm transition-all duration-300 hover:translate-x-1 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-1">
              <h4 className="text-lg font-serif font-bold text-blue-900 mb-6">Support</h4>
              <ul className="space-y-4">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-teal-700 text-sm transition-all duration-300 hover:translate-x-1 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-1">
              <h4 className="text-lg font-serif font-bold text-blue-900 mb-6">Community</h4>
              <ul className="space-y-4">
                {communityLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-teal-700 text-sm transition-all duration-300 hover:translate-x-1 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* More from TalentNest */}
            <div className="space-y-1">
              <h4 className="text-lg font-serif font-bold text-blue-900 mb-6">More from TalentNest</h4>
              <ul className="space-y-4">
                {moreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-teal-700 text-sm transition-all duration-300 hover:translate-x-1 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social*/}
            <div className="space-y-6">
              <h4 className="text-lg font-serif font-bold text-blue-900 mb-6">Connect With Us</h4>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
              
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gradient-to-r from-blue-200 to-teal-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <Link href="/" className="text-3xl font-serif font-bold bg-gradient-to-r from-blue-900 via-teal-700 to-blue-800 bg-clip-text text-transparent">
                TalentNest<span className="text-orange-600">®</span>
              </Link>
              <span className="text-gray-600 text-sm font-medium">
                © TalentNest International Ltd. 2024
              </span>
            </div>
            
            <div className="flex items-center space-x-8 text-sm">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-blue-800 transition-all duration-300 font-medium hover:underline decoration-blue-300"
              >
                Cookies Policy
              </Link>
              <Link 
                href="/" 
                className="text-gray-600 hover:text-blue-800 transition-all duration-300 font-medium hover:underline decoration-blue-300"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/" 
                className="text-gray-600 hover:text-blue-800 transition-all duration-300 font-medium hover:underline decoration-blue-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}