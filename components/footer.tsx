"use client"

import { Instagram, Linkedin, Youtube, MessageSquare } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: <Instagram className="h-4 w-4" />, href: "https://instagram.com/clickers_45", label: "Instagram" },
    {
      icon: <Linkedin className="h-4 w-4" />,
      href: "https://www.linkedin.com/in/vishnu-palvi-93a98225b/",
      label: "LinkedIn",
    },
    { icon: <Youtube className="h-4 w-4" />, href: "https://www.youtube.com/@45_clickers", label: "YouTube" },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      href: "https://whatsapp.com/channel/0029VaFKzHf5PO0yidMG0A1o",
      label: "WhatsApp",
    },
  ]

  return (
    <footer className="relative pt-10 pb-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">&copy; {currentYear} 45Clickers. All Rights Reserved.</p>
          </div>

          <div className="flex items-center">
            <p className="text-gray-400 text-sm mr-4">Built with ❤️ by Team 45Clickers</p>
          </div>

          <div className="flex space-x-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 transition-colors border border-gray-800"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
    </footer>
  )
}
