"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Theme = "light" | "dark" | "system"

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    // Get theme from localStorage or default to system
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    // Remove existing classes
    root.classList.remove("light", "dark")

    // Apply theme
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  const changeTheme = (newTheme: Theme) => {
    // Save to localStorage
    localStorage.setItem("theme", newTheme)

    // Update state
    setTheme(newTheme)

    // Apply theme
    applyTheme(newTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          {theme === "light" && <Sun className="h-5 w-5" />}
          {theme === "dark" && <Moon className="h-5 w-5" />}
          {theme === "system" && <Monitor className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          <span>בהיר</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          <span>כהה</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("system")}>
          <Monitor className="h-4 w-4 mr-2" />
          <span>מערכת</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

