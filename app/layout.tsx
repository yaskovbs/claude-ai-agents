import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import Navigation from "@/components/navigation"
import ThemeSwitcher from "@/components/theme-switcher"
import LanguageSwitcher from "@/components/language-switcher"
// הוספת ייבוא של רכיב ה-Footer
import Footer from "@/components/footer"
// הוספת ייבוא של UserProfile
import UserProfile from "@/components/user-profile"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Claude 3.7 AI Agent",
  description: "AI Agent powered by Claude 3.7",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI Agent powered by Claude 3.7" />
        <meta name="theme-color" content="#6d28d9" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex flex-1 flex-col md:flex-row">
              <Navigation />
              <main className="flex-1 pb-16 md:pb-0 flex flex-col">
                <div className="fixed top-4 right-4 z-50 flex space-x-2 items-center">
                  <UserProfile />
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                </div>
                <div className="flex-1">{children}</div>
                <Footer />
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'