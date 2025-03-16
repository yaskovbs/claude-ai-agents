"use client"

import type React from "react"
import { Bot } from "lucide-react"
import ChatMessage from "./chat-message"

interface ChatMessagesProps {
  messages: any[]
  isLoading: boolean
  chatContainerRef: React.RefObject<HTMLDivElement>
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export default function ChatMessages({ messages, isLoading, chatContainerRef, messagesEndRef }: ChatMessagesProps) {
  return (
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
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

