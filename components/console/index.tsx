"use client"

import { useState } from "react"
import ConsoleHeader from "./console-header"
import ConsoleContent from "./console-content"

interface ConsoleProps {
  logs: string[]
  clearLogs: () => void
}

export default function Console({ logs, clearLogs }: ConsoleProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
      <ConsoleHeader
        isExpanded={isExpanded}
        toggleConsole={toggleConsole}
        copyLogs={copyLogs}
        clearLogs={clearLogs}
        logsCount={logs.length}
      />

      {isExpanded && <ConsoleContent logs={logs} />}
    </div>
  )
}

