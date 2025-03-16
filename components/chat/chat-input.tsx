"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Send, Paperclip, Sparkles, Smile, Mic } from "lucide-react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  isMobile: boolean
  setShowFileUpload: (show: boolean) => void
  setShowTextEnhancer: (show: boolean) => void
  disabled: boolean
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isMobile,
  setShowFileUpload,
  setShowTextEnhancer,
  disabled,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex-grow relative">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="שאל את Claude..."
          className="pr-20 py-6 text-base rounded-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
          disabled={disabled || isLoading}
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
                disabled={disabled || isLoading}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                disabled={disabled || isLoading}
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
            disabled={disabled || isLoading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        disabled={disabled || isLoading || !input.trim()}
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
          disabled={disabled || isLoading}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </form>
  )
}

