"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, TerminalIcon, Copy, Trash } from "lucide-react"

interface ConsoleProps {
  logs: string[]
  clearLogs: () => void
}

export default function Console({ logs, clearLogs }: ConsoleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const consoleRef = useRef<HTMLDivElement>(null)

  // גלילה אוטומטית לתחתית הקונסול כאשר מתווספים לוגים חדשים
  useEffect(() => {
    if (consoleRef.current && isExpanded) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [logs, isExpanded])

  const toggleConsole = () => {
    setIsExpanded(!isExpanded)
  }

  const copyLogs = () => {
    const text = logs.join("\n")
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("הלוגים הועתקו ללוח")
      })
      .catch((err) => {
        console.error("שגיאה בהעתקת הלוגים:", err)
      })
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-20 transition-all duration-300 ${isExpanded ? "h-64" : "h-10"} bg-gray-900 text-white border-t border-gray-700`}
    >
      <div className="flex items-center justify-between px-4 h-10 bg-gray-800">
        <div className="flex items-center">
          <TerminalIcon className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">קונסול</span>
          <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">{logs.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isExpanded && (
            <>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={copyLogs}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-white"
                onClick={clearLogs}
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={toggleConsole}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div ref={consoleRef} className="h-[calc(100%-2.5rem)] overflow-y-auto p-4 font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-4">אין לוגים להצגה</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-500 mr-2">{`[${index + 1}]`}</span>
                <span className={log.includes("error") || log.includes("שגיאה") ? "text-red-400" : "text-green-300"}>
                  {log}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

