"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Github, Key } from "lucide-react"

export default function GithubLoginPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError("נא להזין טוקן גיטהאב")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // כאן בעתיד תהיה התחברות אמיתית לגיטהאב עם הטוקן
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // שמירת מידע על ההתחברות ב-localStorage
      localStorage.setItem("githubConnected", "true")
      localStorage.setItem("githubToken", token)

      setSuccess("התחברת בהצלחה לגיטהאב")

      // מעבר לדף הבית אחרי 2 שניות
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError("אירעה שגיאה בהתחברות. נסה שוב.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // כאן בעתיד תהיה התחברות אמיתית לגיטהאב דרך OAuth
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // שמירת מידע על ההתחברות ב-localStorage
      localStorage.setItem("githubConnected", "true")
      localStorage.setItem("githubUsername", "github_user")

      setSuccess("התחברת בהצלחה לגיטהאב")

      // מעבר לדף הבית אחרי 2 שניות
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError("אירעה שגיאה בהתחברות. נסה שוב.")
      console.error("OAuth login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold text-center">התחברות לגיטהאב</CardTitle>
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
              onClick={handleOAuthLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <Github className="h-5 w-5" />
              )}
              התחבר באמצעות גיטהאב
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">או</span>
              </div>
            </div>

            <form onSubmit={handleTokenLogin} className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium mb-1">
                  טוקן גיטהאב
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="token"
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="הזן טוקן גיטהאב"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ניתן ליצור טוקן גיטהאב ב-
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    הגדרות החשבון שלך
                  </a>
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                ) : (
                  "התחבר עם טוקן"
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              בהתחברות אתה מאשר את תנאי השימוש ומדיניות הפרטיות שלנו.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

