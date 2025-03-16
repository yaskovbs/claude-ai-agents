"use client"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ChatMessageReasoningProps {
  reasoning: string | null
  showReasoning: boolean
  setShowReasoning: (show: boolean) => void
}

export default function ChatMessageReasoning({
  reasoning,
  showReasoning,
  setShowReasoning,
}: ChatMessageReasoningProps) {
  if (!reasoning) return null

  return (
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
  )
}

