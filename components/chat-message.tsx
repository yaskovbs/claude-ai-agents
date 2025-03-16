"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  role: string
  content: any
  attachment?: {
    type: string
    url: string
    name: string
  } | null
  reasoning?: string | null
  timestamp?: string
}

export default function ChatMessage({ role, content, attachment, reasoning, timestamp }: ChatMessageProps) {
  const [showReasoning, setShowReasoning] = React.useState(false)

  const isUser = role === "user"
  const messageTime = timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // Helper function to safely convert content to string
  const getContentAsString = (content: any): string => {
    if (content === null || content === undefined) return ""
    if (typeof content === "string") return content
    if (typeof content === "number" || typeof content === "boolean") return String(content)
    if (content instanceof Error) return content.message || "Error"
    if (typeof content === "object") {
      // If it's an object with a toString method, use it
      if (content.toString !== Object.prototype.toString) {
        return content.toString()
      }
      // Otherwise, try to JSON stringify it
      try {
        return JSON.stringify(content)
      } catch (e) {
        return "[Object]"
      }
    }
    return String(content)
  }

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          <Avatar className={isUser ? "bg-blue-100" : "bg-purple-100"}>
            <AvatarFallback>{isUser ? "U" : "C"}</AvatarFallback>
            <AvatarImage src={isUser ? "/user-avatar.png" : "/claude-avatar.png"} />
          </Avatar>
        </div>

        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl ${isUser ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 dark:text-gray-100"}`}
          >
            <div className="whitespace-pre-wrap">{getContentAsString(content)}</div>

            {attachment && (
              <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded border">
                {attachment.type && attachment.type.startsWith("image/") ? (
                  <div>
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt={attachment.name || "Attachment"}
                      className="max-w-full h-auto rounded"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {attachment.name || "Attachment"}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="text-sm">{attachment.name || "Attachment"}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}>{messageTime}</div>

          {reasoning && (
            <div className="mt-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowReasoning(!showReasoning)}>
                {showReasoning ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    הסתר חשיבה
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    הצג חשיבה
                  </>
                )}
              </Button>

              {showReasoning && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {reasoning}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

