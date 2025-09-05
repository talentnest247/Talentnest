import Link from "next/link"

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
    <footer className="border-t bg-card text-black dark:text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">TalentNest</h3>
            <p className="text-black dark:text-white">
              Connecting university students through skills, creativity, and collaboration.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
      <h4 className="font-semibold mb-4">{section.title}</h4>
      <ul className="space-y-2 text-black dark:text-white">
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
    <div className="border-t mt-8 pt-8 text-center text-black dark:text-white">
          <p>&copy; 2024 TalentNest. Built for university communities.</p>
        </div>
      </div>
    </footer>
  )
}
