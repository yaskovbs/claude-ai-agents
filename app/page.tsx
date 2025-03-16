"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Settings, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import ChatTab from "@/components/chat/chat-tab"
import BackgroundCarousel from "@/components/background-carousel"

// קומפוננט טעינה
const LoadingComponent = () => (
  <div className="flex justify-center items-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
)

// Helper function to safely convert errors to strings
const errorToString = (error: any): string => {
  if (typeof error === "string") return error
  if (error instanceof Error) return error.message || "An error occurred"
  if (error && typeof error.message === "string") return error.message
  return "An unexpected error occurred"
}

export default function Home() {
  const [anthropicApiKey, setAnthropicApiKey] = useState<string | null>(null)
  const [adminApiKey, setAdminApiKey] = useState<string | null>(null)
  const [useAdminKey, setUseAdminKey] = useState(false)
  const [isKeyLoaded, setIsKeyLoaded] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showTextEnhancer, setShowTextEnhancer] = useState(false)
  const [currentAttachment, setCurrentAttachment] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [hasSystemKey, setHasSystemKey] = useState(true) // תמיד יש מפתח מערכת
  const [hasBackupKey, setHasBackupKey] = useState(false)
  const { user, profile } = useAuth()

  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usageWarning, setUsageWarning] = useState<string | null>(null)
  const [modelInfo, setModelInfo] = useState<string | null>(null)

  useEffect(() => {
    // בדוק אם יש מפתח מערכת ומפתח גיבוי
    const checkSystemKey = async () => {
      try {
        const response = await fetch("/api/check-system-key")
        if (response.ok) {
          const data = await response.json()
          setHasSystemKey(data.hasSystemKey)
          setHasBackupKey(data.hasBackupKey)
        }
      } catch (err) {
        console.error("Error checking system key:", err)
      }
    }

    checkSystemKey()

    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (e) {
        console.error("Error parsing saved messages:", e)
      }
    }

    setIsKeyLoaded(true)

    // בדוק אם יש הודעת אזהרה על שימוש יתר
    const lastUsageWarning = localStorage.getItem("usageWarning")
    if (lastUsageWarning) {
      const warningTime = new Date(lastUsageWarning)
      const now = new Date()
      // אם האזהרה היא מהיום, הצג אותה
      if (warningTime.toDateString() === now.toDateString()) {
        setUsageWarning("נראה שהגעת למגבלת השימוש היומית. המערכת תנסה להשתמש במודלים אחרים אם יש צורך.")
      }
    }

    // בדוק אם יש מידע על המודל האחרון שהיה בשימוש
    const lastModelUsed = localStorage.getItem("lastModelUsed")
    if (lastModelUsed && lastModelUsed !== "claude-3-sonnet") {
      setModelInfo(`המערכת משתמשת כרגע במודל ${lastModelUsed} במקום Claude 3 Sonnet`)
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const goToSettings = () => {
    router.push("/settings")
  }

  const goToAdmin = () => {
    router.push("/admin")
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !currentAttachment) return

    setIsLoading(true)
    setError(null)

    // Add user message to chat
    const userMessage = {
      role: "user",
      content: input || "",
      attachment: currentAttachment,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setCurrentAttachment(null)

    try {
      // תמיד נשתמש במפתח המערכת
      const apiKeyToUse = "system_key"

      // הכנת ההודעות לשליחה - רק עם role ו-content
      const messagesToSend = []

      for (const msg of [...messages, userMessage]) {
        // וידוא שיש role תקין
        let role = "user"
        if (typeof msg.role === "string" && (msg.role === "user" || msg.role === "assistant")) {
          role = msg.role
        }

        // וידוא שיש content תקין
        let content = ""
        if (typeof msg.content === "string") {
          content = msg.content
        } else if (msg.content !== null && msg.content !== undefined) {
          content = String(msg.content)
        }

        messagesToSend.push({ role, content })
      }

      console.log("Sending request to chat-with-claude endpoint")

      // שליחת הבקשה ל-API - using the new chat-with-claude endpoint
      const response = await fetch("/api/chat-with-claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSend,
          apiKey: apiKeyToUse,
        }),
      })

      if (!response.ok) {
        let errorMessage = "שגיאה בתקשורת עם Claude"
        try {
          const errorData = await response.json()
          if (errorData && errorData.error) {
            errorMessage = errorData.error
            console.error("Error details:", errorData)

            // בדוק אם זו שגיאת מגבלת שימוש
            if (response.status === 429 || errorMessage.includes("rate limit") || errorMessage.includes("מגבלת")) {
              // שמור את זמן האזהרה
              localStorage.setItem("usageWarning", new Date().toISOString())
              setUsageWarning("נראה שהגעת למגבלת השימוש היומית. המערכת תנסה להשתמש במודלים אחרים אם יש צורך.")
            }
          }
        } catch (e) {
          console.error("Error parsing error response:", e)
        }
        throw new Error(errorMessage)
      }

      // Parse the response as JSON
      const data = await response.json()
      console.log("Response from Claude API:", data)

      // בדוק אם התגובה מכילה מידע על המודל שהיה בשימוש
      if (data.model && data.model !== "claude-3-sonnet") {
        localStorage.setItem("lastModelUsed", data.model)
        setModelInfo(`המערכת משתמשת כרגע במודל ${data.model} במקום Claude 3 Sonnet`)
      } else if (data.model === "claude-3-sonnet") {
        localStorage.removeItem("lastModelUsed")
        setModelInfo(null)
      }

      // Extract the content from the response
      const assistantContent =
        data.content && data.content[0] && data.content[0].text ? data.content[0].text : "לא התקבלה תשובה תקינה"

      // Add the assistant's response to the chat
      const assistantMessage = {
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Error in handleFormSubmit:", err)
      // Convert any error to a string message
      setError(errorToString(err))
    } finally {
      setIsLoading(false)
    }
  }

  const reload = () => {
    // Reload the conversation or retry the last message
    setError(null)
  }

  const handleFileUpload = (file: File, fileType: string) => {
    try {
      if (!file) {
        throw new Error("No file selected")
      }

      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file)

      // Set the current attachment with all required properties
      setCurrentAttachment({
        type: file.type || "application/octet-stream",
        url: fileUrl,
        name: file.name || "Unnamed file",
        fileType: fileType || "other", // Ensure fileType is never undefined
      })

      // Hide the file upload component
      setShowFileUpload(false)
    } catch (err) {
      console.error("Error handling file upload:", err)
      setError(errorToString(err))
    }
  }

  const clearChat = () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את כל ההודעות?")) {
      setMessages([])
      localStorage.removeItem("chatMessages")
    }
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      {/* Add the background carousel at the top of the page */}
      <div className="w-full max-w-4xl mb-6">
        <BackgroundCarousel />
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl md:text-2xl font-bold">Claude 3 Sonnet AI Agent</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={clearChat}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={goToSettings}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={goToAdmin}>
                <Lock className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {usageWarning && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            <p className="font-bold">אזהרה</p>
            <p>{usageWarning}</p>
          </div>
        )}
        {modelInfo && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
            <p className="font-bold">מידע</p>
            <p>{modelInfo}</p>
          </div>
        )}
        {hasBackupKey && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
            <p className="font-bold">מפתח גיבוי</p>
            <p>מפתח גיבוי זמין ויופעל אוטומטית אם המפתח הראשי ייכשל</p>
          </div>
        )}
        <CardContent className="p-0">
          {isKeyLoaded ? (
            <ChatTab
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleFormSubmit}
              isLoading={isLoading}
              error={error}
              reload={reload}
              showFileUpload={showFileUpload}
              setShowFileUpload={setShowFileUpload}
              showTextEnhancer={showTextEnhancer}
              setShowTextEnhancer={setShowTextEnhancer}
              currentAttachment={currentAttachment}
              setCurrentAttachment={setCurrentAttachment}
              messagesEndRef={messagesEndRef}
              anthropicApiKey={anthropicApiKey}
              useAdminKey={useAdminKey}
              hasSystemKey={hasSystemKey}
              goToSettings={goToSettings}
              handleFileUpload={handleFileUpload}
            />
          ) : (
            <LoadingComponent />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

