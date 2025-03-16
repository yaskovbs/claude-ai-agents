"use client"

import { useRef, useEffect } from "react"

interface ConsoleContentProps {
  logs: string[]
}

export default function ConsoleContent({ logs }: ConsoleContentProps) {
  const consoleRef = useRef<HTMLDivElement>(null)

  // גלילה אוטומטית לתחתית הקונסול כאשר מתווספים לוגים חדשים
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [logs])

  return (
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
  )
}

