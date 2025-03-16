"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, X } from "lucide-react"

export default function AdminPage() {
  const [adminApiKey, setAdminApiKey] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem("adminAuthenticated") === "true"
    setIsAuthenticated(adminAuth)

    // Load admin API key if authenticated
    if (adminAuth) {
      const savedKey = localStorage.getItem("adminAnthropicApiKey") || ""
      setAdminApiKey(savedKey)
    }
  }, [])

  const authenticate = () => {
    // סיסמת המנהל המעודכנת
    if (password === "4#&DKjR*s7Bv#_ch2") {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuthenticated", "true")
      setAuthError(null)
    } else {
      setAuthError("סיסמה שגויה")
    }
  }

  const saveSettings = () => {
    try {
      // Save admin API key to localStorage
      if (adminApiKey) {
        localStorage.setItem("adminAnthropicApiKey", adminApiKey)
      } else {
        localStorage.removeItem("adminAnthropicApiKey")
      }

      setSaveSuccess(true)
      setSaveError(null)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      setSaveError("אירעה שגיאה בשמירת ההגדרות")
      setSaveSuccess(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuthenticated")
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold">ניהול מערכת</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center">התחברות מנהל</h3>

              {authError && (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800">
                  <AlertDescription className="text-red-700 dark:text-red-100 flex items-center">
                    <X className="h-4 w-4 mr-2" />
                    {authError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-password">סיסמת מנהל</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הזן את סיסמת המנהל"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={authenticate}>התחבר</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {saveSuccess && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800">
                  <AlertDescription className="text-green-700 dark:text-green-100 flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    ההגדרות נשמרו בהצלחה
                  </AlertDescription>
                </Alert>
              )}

              {saveError && (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800">
                  <AlertDescription className="text-red-700 dark:text-red-100 flex items-center">
                    <X className="h-4 w-4 mr-2" />
                    {saveError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-api-key">מפתח API של Anthropic למנהל</Label>
                <Input
                  id="admin-api-key"
                  type="password"
                  value={adminApiKey}
                  onChange={(e) => setAdminApiKey(e.target.value)}
                  placeholder="הזן את מפתח ה-API של Anthropic למנהל"
                />
                <p className="text-sm text-gray-500">מפתח זה ישמש משתמשים שאין להם מפתח API משלהם</p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={logout}>
                  התנתק
                </Button>
                <Button onClick={saveSettings}>שמור הגדרות</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

