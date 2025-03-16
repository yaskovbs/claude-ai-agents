"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Copy, Trash, TerminalIcon } from "lucide-react"

interface ConsoleHeaderProps {
  isExpanded: boolean
  toggleConsole: () => void
  copyLogs: () => void
  clearLogs: () => void
  logsCount: number
}

export default function ConsoleHeader({
  isExpanded,
  toggleConsole,
  copyLogs,
  clearLogs,
  logsCount,
}: ConsoleHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 h-10 bg-gray-800">
      <div className="flex items-center">
        <TerminalIcon className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">קונסול</span>
        <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">{logsCount}</span>
      </div>
      <div className="flex items-center space-x-2">
        {isExpanded && (
          <>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={copyLogs}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={clearLogs}>
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={toggleConsole}>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

