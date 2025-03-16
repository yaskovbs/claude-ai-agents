"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, Paperclip, Sparkles, Smile, Mic } from "lucide-react"
import { LazyTextEnhancer, LazyFileUpload } from "@/components/lazy-components"
import ChatMessage from "@/components/chat-message"
import { sanitizeInput } from "@/lib/security"
import { useState, useEffect, useRef } from "react"
import { Bot } from "lucide-react"

interface ChatTabProps {
  messages: any[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  error: any
  reload: () => void
  showFileUpload: boolean
  setShowFileUpload: (show: boolean) => void
  showTextEnhancer: boolean
  setShowTextEnhancer: (show: boolean) => void
  currentAttachment: any
  setCurrentAttachment: (attachment: any) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
  anthropicApiKey: string | null
  useAdminKey: boolean
  hasSystemKey: boolean
  goToSettings: () => void
  handleFileUpload: (file: File) => void
}

export default function ChatTab({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  reload,
  showFileUpload,
  setShowFileUpload,
  showTextEnhancer,
  setShowTextEnhancer,
  currentAttachment,
  setCurrentAttachment,
  messagesEndRef,
  anthropicApiKey,
  useAdminKey,
  hasSystemKey,
  goToSettings,
  handleFileUpload,
}: ChatTabProps) {
  const [isMobile, setIsMobile] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Helper function to get error message as string
  const getErrorMessage = (error: any): string => {
    if (!error) return ""
    if (typeof error === "string") return sanitizeInput(error)
    if (error instanceof Error) return sanitizeInput(error.message || "An error occurred")
    if (error.message && typeof error.message === "string") return sanitizeInput(error.message)
    return "אירעה שגיאה. נסה שוב."
  }

  // Sanitize input before submitting
  const handleSanitizedSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Sanitize input before submitting
    const sanitizedInput = sanitizeInput(input)
    // Update the input with sanitized version
    handleInputChange({ target: { value: sanitizedInput } } as React.ChangeEvent<HTMLInputElement>)
    // Submit the form
    handleSubmit(e)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)]">
      {!anthropicApiKey && !useAdminKey && !hasSystemKey ? (
        <Alert className="bg-amber-50 border-amber-200 mb-4 dark:bg-amber-900 dark:border-amber-800 dark:text-amber-100">
          <AlertDescription className="text-amber-700 dark:text-amber-100">
            נדרש מפתח API של Anthropic כדי להשתמש בצ'אט.{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-amber-700 dark:text-amber-100 underline"
              onClick={goToSettings}
            >
              הוסף מפתח API
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {useAdminKey && (
            <Alert className="bg-blue-50 border-blue-200 mb-4 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-100">
              <AlertDescription className="text-blue-700 dark:text-blue-100">משתמש במפתח API של המנהל</AlertDescription>
            </Alert>
          )}

          {!anthropicApiKey && !useAdminKey && hasSystemKey && (
            <Alert className="bg-green-50 border-green-200 mb-4 dark:bg-green-900 dark:border-green-800 dark:text-green-100">
              <AlertDescription className="text-green-700 dark:text-green-100">
                משתמש במפתח API של המערכת
              </AlertDescription>
            </Alert>
          )}

          {showFileUpload && (
            <div className="mb-4">
              <LazyFileUpload onFileUpload={handleFileUpload} onCancel={() => setShowFileUpload(false)} />
            </div>
          )}

          {showTextEnhancer && (
            <div className="mb-4">
              <LazyTextEnhancer onClose={() => setShowTextEnhancer(false)} />
            </div>
          )}

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 rounded-t-lg"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <Bot className="h-12 w-12 mb-4 text-purple-500" />
                <h3 className="text-lg font-medium mb-2">ברוכים הבאים ל-Claude 3.7 AI Agent</h3>
                <p className="max-w-md">שאל את Claude כל שאלה, או השתמש בכלים המתקדמים ליצירת אתרים, אפליקציות ועוד.</p>
              </div>
            ) : (
              messages.map((message, index) => {
                // Extract reasoning from message parts if available
                let reasoning = null
                if (message && message.role === "assistant" && message.parts && Array.isArray(message.parts)) {
                  const reasoningPart = message.parts.find(
                    (part) => part && typeof part === "object" && part.type === "reasoning",
                  )

                  if (reasoningPart && reasoningPart.details && Array.isArray(reasoningPart.details)) {
                    reasoning = reasoningPart.details
                      .filter(Boolean)
                      .map((detail) =>
                        detail && typeof detail === "object" && detail.type === "text" ? detail.text : "<redacted>",
                      )
                      .join("\n")
                  }
                }

                return (
                  <ChatMessage
                    key={index}
                    role={message.role || "user"}
                    content={message.content || ""}
                    attachment={message.attachment || null}
                    reasoning={reasoning}
                    timestamp={message.timestamp || undefined}
                  />
                )
              })
            )}

            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl max-w-[80%]">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <Alert className="bg-red-50 border-red-200 mb-4 dark:bg-red-900 dark:border-red-800 dark:text-red-100">
              <AlertDescription className="text-red-700 dark:text-red-100">
                {getErrorMessage(error)}
                <Button
                  variant="link"
                  className="p-0 h-auto text-red-700 dark:text-red-100 underline ml-2"
                  onClick={() => reload()}
                >
                  נסה שוב
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {currentAttachment && currentAttachment.name && (
            <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900 rounded-md flex items-center">
              <span className="text-sm">קובץ מצורף: {currentAttachment.name}</span>
              <Button variant="ghost" size="sm" className="ml-auto h-6 px-2" onClick={() => setCurrentAttachment(null)}>
                הסר
              </Button>
            </div>
          )}

          <div className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-lg">
            <form onSubmit={handleSanitizedSubmit} className="flex items-center gap-2">
              <div className="flex-grow relative">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="שאל את Claude..."
                  className="pr-20 py-6 text-base rounded-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                  disabled={(!anthropicApiKey && !useAdminKey && !hasSystemKey) || isLoading}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  {!isMobile && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => setShowTextEnhancer(true)}
                        disabled={(!anthropicApiKey && !useAdminKey && !hasSystemKey) || isLoading}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        disabled={(!anthropicApiKey && !useAdminKey && !hasSystemKey) || isLoading}
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowFileUpload(true)}
                    disabled={(!anthropicApiKey && !useAdminKey && !hasSystemKey) || isLoading}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={
                  (!anthropicApiKey && !useAdminKey && !hasSystemKey) ||
                  isLoading ||
                  (!input.trim() && !currentAttachment)
                }
                className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
              {!isMobile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 p-0 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  disabled={(!anthropicApiKey && !useAdminKey && !hasSystemKey) || isLoading}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  )
}

