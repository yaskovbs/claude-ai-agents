"use client"

import { useRef } from "react"

import type React from "react"

import { useState, useEffect } from "react"
import { LazyTextEnhancer, LazyFileUpload } from "@/components/lazy-components"
import { sanitizeInput } from "@/lib/security"
import ChatMessages from "./chat-messages"
import ChatInput from "./chat-input"
import ChatAlerts from "./chat-alerts"

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

  const apiKeyMissing = !anthropicApiKey && !useAdminKey && !hasSystemKey

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)]">
      <ChatAlerts
        error={error}
        reload={reload}
        apiKeyMissing={apiKeyMissing}
        useAdminKey={useAdminKey}
        hasSystemKey={hasSystemKey}
        goToSettings={goToSettings}
        currentAttachment={currentAttachment}
        setCurrentAttachment={setCurrentAttachment}
      />

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

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        chatContainerRef={chatContainerRef}
        messagesEndRef={messagesEndRef}
      />

      <div className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-lg">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSanitizedSubmit}
          isLoading={isLoading}
          isMobile={isMobile}
          setShowFileUpload={setShowFileUpload}
          setShowTextEnhancer={setShowTextEnhancer}
          disabled={apiKeyMissing}
        />
      </div>
    </div>
  )
}

