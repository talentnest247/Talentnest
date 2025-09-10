import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { href: "#services", label: "Browse Services" },
        { href: "/signup", label: "Create Profile" },
        { href: "#how-it-works", label: "How It Works" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/help", label: "Help Center" },
        { href: "/contact", label: "Contact Us" },
        { href: "/safety", label: "Safety Guidelines" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/community", label: "Community Guidelines" },
      ],
    },
  ]

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 mr-3 relative">
                <Image 
                  src="/unilorin-logo.png" 
                  alt="University of Ilorin Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-card-foreground">TalentNest</h3>
                <span className="text-xs text-muted-foreground">University of Ilorin</span>
              </div>
            </div>
            <p className="text-card-foreground/80">
              Connecting university students through skills, creativity, and collaboration within the University of Ilorin community.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-card-foreground">{section.title}</h4>
              <ul className="space-y-2 text-card-foreground/80">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-card-foreground/80">
          <p>&copy; 2024 TalentNest. Built for university communities.</p>
        </div>
      </div>
    </footer>
  )
}
