"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import BackgroundCarousel from "@/components/background-carousel"

export default function Settings() {
  const [apiKey, setApiKey] = useState("")
  const [useAdminKey, setUseAdminKey] = useState(false)
  const [hasSystemKey, setHasSystemKey] = useState(false)
  const [availableModels, setAvailableModels] = useState<string[]>([
    "claude-3-sonnet",
    "claude-3-opus",
    "claude-3-haiku",
    "claude-3-5-sonnet",
    "claude-3-5-haiku",
    "claude-3-7-sonnet",
  ])
  const [selectedModel, setSelectedModel] = useState("claude-3-sonnet")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Load API key from localStorage
    const savedKey = localStorage.getItem("anthropicApiKey") || ""
    setApiKey(savedKey)

    // Check if using admin key
    const useAdminKeyByDefault = localStorage.getItem("useAdminKeyByDefault") === "true"
    setUseAdminKey(useAdminKeyByDefault)

    // Check if system has API key
    const checkSystemKey = async () => {
      try {
        const response = await fetch("/api/check-system-key")
        if (response.ok) {
          const data = await response.json()
          setHasSystemKey(data.hasSystemKey)
        }
      } catch (err) {
        console.error("Error checking system key:", err)
      }
    }

    checkSystemKey()

    // Load selected model from localStorage
    const savedModel = localStorage.getItem("selectedModel") || "claude-3-sonnet"
    setSelectedModel(savedModel)
  }, [])

  const saveSettings = () => {
    // Save API key to localStorage
    localStorage.setItem("anthropicApiKey", apiKey)

    // Save admin key preference
    localStorage.setItem("useAdminKeyByDefault", useAdminKey.toString())

    // Save selected model
    localStorage.setItem("selectedModel", selectedModel)

    // Navigate back to home
    router.push("/")
  }

  const goBack = () => {
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      {/* Add the background carousel at the top of the page */}
      <div className="w-full max-w-4xl mb-6">
        <BackgroundCarousel />
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold">הגדרות</CardTitle>
          <CardDescription className="text-white/80">הגדר את מפתח ה-API של Anthropic והעדפות אחרות</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">מפתח API של Anthropic</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              השג מפתח API מ-{" "}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Anthropic Console
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-select">בחר מודל Claude</Label>
            <select
              id="model-select"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              בחר את המודל של Claude שברצונך להשתמש בו. המודלים החדשים יותר מספקים תוצאות טובות יותר אך עשויים להיות
              יקרים יותר.
            </p>
          </div>

          {hasSystemKey && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch id="use-admin-key" checked={useAdminKey} onCheckedChange={setUseAdminKey} />
              <Label htmlFor="use-admin-key">השתמש במפתח מערכת כברירת מחדל</Label>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goBack}>
            ביטול
          </Button>
          <Button onClick={saveSettings}>שמור הגדרות</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

