"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { TerminalIcon, Save, Download } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TerminalPage() {
  const router = useRouter()
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState<string[]>([
    "Welcome to Claude 3.7 Terminal",
    "Type 'help' to see available commands",
  ])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()

    if (!command.trim()) return

    // Add command to history
    setHistory([...history, command])
    setHistoryIndex(-1)

    // Add command to output
    setOutput((prev) => [...prev, `> ${command}`])

    // Process command
    if (command.toLowerCase() === "help") {
      setOutput((prev) => [
        ...prev,
        "Available commands:",
        "- help: Show this help",
        "- clear: Clear terminal",
        "- memory: Go to memory page",
        "- chat: Go to chat page",
        "- websites: Go to websites page",
        "- database: Go to database page",
        "- settings: Go to settings page",
        "- admin: Go to admin page",
      ])
    } else if (command.toLowerCase() === "clear") {
      setOutput(["Terminal cleared"])
    } else if (command.toLowerCase() === "memory") {
      router.push("/memory")
    } else if (command.toLowerCase() === "chat") {
      router.push("/")
    } else if (command.toLowerCase() === "websites") {
      router.push("/websites")
    } else if (command.toLowerCase() === "database") {
      router.push("/database")
    } else if (command.toLowerCase() === "settings") {
      router.push("/settings")
    } else if (command.toLowerCase() === "admin") {
      router.push("/admin")
    } else {
      setOutput((prev) => [...prev, `Command not recognized: ${command}`])
    }

    // Clear input
    setCommand("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(history[history.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(history[history.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand("")
      }
    }
  }

  const saveTerminalOutput = () => {
    localStorage.setItem("terminalOutput", JSON.stringify(output))
    setOutput((prev) => [...prev, "Terminal output saved"])
  }

  const downloadTerminalOutput = () => {
    const text = output.join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "terminal-output.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl md:text-2xl font-bold">טרמינל</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white" onClick={saveTerminalOutput}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white" onClick={downloadTerminalOutput}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-black text-green-400 p-4 rounded-md font-mono h-[60vh] flex flex-col">
            <div className="flex-1 overflow-auto">
              {output.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
            <form onSubmit={handleCommand} className="mt-2 flex items-center">
              <span className="mr-2">$</span>
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none text-green-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="הקלד פקודה..."
              />
              <Button type="submit" variant="ghost" size="icon" className="text-green-400">
                <TerminalIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

