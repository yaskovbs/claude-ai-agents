"use client"
import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, Paperclip, Code, Download, Smartphone, Monitor, Globe } from "lucide-react"
import { LazyFileUpload } from "@/components/lazy-components"
import ChatMessage from "@/components/chat/chat-message"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateAppPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [generatedCode, setGeneratedCode] = useState("")
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [currentAttachment, setCurrentAttachment] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [appType, setAppType] = useState<string>("web")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !currentAttachment) return

    // Add user message
    const userMessage = {
      role: "user",
      content: input,
      attachment: currentAttachment,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)
    setError(null)

    // הוספת לוג לקונסול
    setConsoleLogs((prev) => [...prev, `בקשה: ${input} (סוג אפליקציה: ${appType})`])

    try {
      // קביעת ה-API key שישמש לשיחה
      let apiKeyToUse = null

      const anthropicApiKey = localStorage.getItem("anthropicApiKey") || ""
      const adminApiKey = localStorage.getItem("adminAnthropicApiKey") || ""
      const useAdminKey = localStorage.getItem("useAdminKeyByDefault") === "true"

      if (anthropicApiKey) {
        apiKeyToUse = anthropicApiKey
      } else if (useAdminKey && adminApiKey) {
        apiKeyToUse = adminApiKey
      } else {
        apiKeyToUse = "system_key" // סימון לשרת להשתמש במפתח המערכת
      }

      if (!apiKeyToUse) {
        throw new Error("אין מפתח API זמין")
      }

      // הוספת לוג לקונסול
      setConsoleLogs((prev) => [...prev, "מערכת: מעבד בקשה..."])

      // דוגמה לתשובה
      const assistantMessage = {
        role: "assistant",
        content: `אני אעזור לך ליצור אפליקציית ${appType === "web" ? "ווב" : appType === "mobile" ? "מובייל" : "דסקטופ"} בהתאם לתיאור שלך. אני מתחיל לעבוד על הקוד הדרוש.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // הוספת לוג לקונסול
      setConsoleLogs((prev) => [...prev, `מערכת: יוצר קוד לאפליקציית ${appType}...`])

      // שליחת בקשה ל-API
      const response = await fetch("/api/generate-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          appType: appType,
          apiKey: apiKeyToUse,
          attachment: currentAttachment
            ? {
                type: currentAttachment?.type || null,
                name: currentAttachment?.name || "Unnamed file",
                url: currentAttachment?.url || null,
                fileType: currentAttachment?.fileType || "other",
              }
            : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "שגיאה ביצירת האפליקציה")
      }

      const data = await response.json()

      // הוספת לוג לקונסול
      setConsoleLogs((prev) => [...prev, "מערכת: קוד נוצר בהצלחה!"])

      // שמירת הקוד שנוצר
      setGeneratedCode(data.generatedCode)

      // הוספת הודעה עם הקוד
      const codeMessage = {
        role: "assistant",
        content: "הנה הקוד שיצרתי עבור האפליקציה שלך. אתה יכול להוריד אותו או לצפות בתצוגה מקדימה.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, codeMessage])
      setCurrentAttachment(null)
    } catch (error: any) {
      console.error("Error generating app:", error)

      // הוספת לוג שגיאה לקונסול
      setConsoleLogs((prev) => [...prev, `שגיאה: אירעה שגיאה ביצירת האפליקציה - ${error.message || error}`])

      // הוספת הודעת שגיאה
      const errorMessage = {
        role: "assistant",
        content: `אירעה שגיאה ביצירת האפליקציה: ${error.message || "אנא נסה שוב"}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, errorMessage])
      setError(error.message || "אירעה שגיאה ביצירת האפליקציה")
    } finally {
      setIsGenerating(false)
    }
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
    } catch (err: any) {
      console.error("Error handling file upload:", err)
      setError(err.message || "אירעה שגיאה בהעלאת הקובץ")
    }
  }

  const downloadCode = () => {
    if (!generatedCode) return

    const extension = appType === "web" ? "js" : appType === "mobile" ? "jsx" : "js"
    const blob = new Blob([generatedCode], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `app.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // הוספת לוג לקונסול
    setConsoleLogs((prev) => [...prev, "מערכת: הקוד הורד בהצלחה"])
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold">יצירת אפליקציה</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {error && (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800">
                <AlertDescription className="text-red-700 dark:text-red-100">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="app-type" className="block text-sm font-medium mb-1">
                  סוג האפליקציה
                </label>
                <Select value={appType} onValueChange={setAppType}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג אפליקציה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        <span>אפליקציית ווב</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2" />
                        <span>אפליקציית מובייל</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="desktop">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        <span>אפליקציית דסקטופ</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-[50vh] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <Code className="h-12 w-12 mb-4 text-purple-500" />
                  <h3 className="text-lg font-medium mb-2">ברוכים הבאים ליוצר האפליקציות</h3>
                  <p className="max-w-md">תאר את האפליקציה שברצונך ליצור, או העלה תמונות וקבצים לעזרה בתהליך היצירה.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      role={message.role}
                      content={message.content}
                      attachment={message.attachment}
                      timestamp={message.timestamp}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {showFileUpload && (
              <div className="mb-4">
                <LazyFileUpload onFileUpload={handleFileUpload} onCancel={() => setShowFileUpload(false)} />
              </div>
            )}

            {currentAttachment && (
              <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900 rounded-md flex items-center">
                <span className="text-sm">קובץ מצורף: {currentAttachment.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-6 px-2"
                  onClick={() => setCurrentAttachment(null)}
                >
                  הסר
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowFileUpload(true)}
                disabled={isGenerating}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="תאר את האפליקציה שברצונך ליצור..."
                  className="min-h-[100px] resize-none"
                  disabled={isGenerating}
                />
              </div>
              <Button type="submit" disabled={isGenerating || (!input.trim() && !currentAttachment)}>
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>

            {generatedCode && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">קוד שנוצר</h3>
                  <Button variant="outline" size="sm" onClick={downloadCode}>
                    <Download className="h-4 w-4 mr-2" />
                    הורד קוד
                  </Button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{generatedCode}</pre>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">לוג מערכת</h3>
              <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-[150px] overflow-y-auto">
                {consoleLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

