"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ChatMessageContent from "./chat-message-content"
import ChatMessageReasoning from "./chat-message-reasoning"

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
  const [showReasoning, setShowReasoning] = useState(false)

  const isUser = role === "user"
  const messageTime = timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

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
          <ChatMessageContent content={content} attachment={attachment} isUser={isUser} />

          <div className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}>{messageTime}</div>

          <ChatMessageReasoning
            reasoning={reasoning}
            showReasoning={showReasoning}
            setShowReasoning={setShowReasoning}
          />
        </div>
      </div>
    </div>
  )
}

