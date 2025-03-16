"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithEmail, signInWithGoogle, signUpWithEmail, checkUserSession } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { ChromeIcon as Google, Mail, Lock } from 'lucide-react'
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const { setUser } = useAuth()

  // בדיקה אם המשתמש כבר מחובר
  useEffect(() => {
    const checkSession = async () => {
      const session = await checkUserSession()
      if (session) {
        setUser(session.user)
        router.push("/")
      }
    }

    checkSession()
  }, [router, setUser])

  // התחברות עם אימייל וסיסמה
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // הרשמה
        const { data, error } = await signUpWithEmail(email, password)

        if (error) throw error

        setSuccess("נרשמת בהצלחה! בדוק את האימייל שלך לאימות החשבון.")
      } else {
        // התחברות
        const { data, error } = await signInWithEmail(email, password)

        if (error) throw error

        if (data.user) {
          setUser(data.user)
          router.push("/")
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setError(err.message || "אירעה שגיאה בתהליך ההתחברות")
    } finally {
      setIsLoading(false)
    }
  }

  // התחברות עם גוגל
  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await signInWithGoogle()

      if (error) throw error

      // הניתוב יתבצע אוטומטית על ידי Supabase
    } catch (err: any) {
      console.error("Google auth error:", err)
      setError(err.message || "אירעה שגיאה בהתחברות עם גוגל")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8 min-h-screen">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Leonardo_Phoenix_10_A_futuristic_illustration_depicting_a_team_1%20%281%29.jpg-gqd3PYofdU8vWrVLVvpwRb5o6jD2nO.jpeg"
          alt="AI team background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>
      
      <Card className="w-full max-w-md mt-20">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold text-center">{isSignUp ? "הרשמה" : "התחברות"}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800">
              <AlertDescription className="text-red-700 dark:text-red-100">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800">
              <AlertDescription className="text-green-700 dark:text-green-100">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Button
              className="w-full flex items-center justify-center gap-2 py-6"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <Google className="h-5 w-5" />
              )}
              התחבר באמצעות גוגל
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">או</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  אימייל
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="הזן את האימייל שלך"
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  סיסמה
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הזן את הסיסמה שלך"
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                ) : isSignUp ? (
                  "הרשמה"
                ) : (
                  "התחברות"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button variant="link" className="text-sm" onClick={() => setIsSignUp(!isSignUp)} disabled={isLoading}>
                {isSignUp ? "כבר יש לך חשבון? התחבר" : "אין לך חשבון? הירשם"}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              בהתחברות אתה מאשר את תנאי השימוש ומדיניות הפרטיות שלנו.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

