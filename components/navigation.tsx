"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Home,
  Settings,
  Lock,
  Database,
  Code,
  Terminal,
  MemoryStickIcon as Memory,
  FolderIcon,
  Github,
  LogIn,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 md:relative md:border-t-0 md:border-r md:h-screen md:w-64 md:p-4 z-10 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex justify-around md:flex-col md:space-y-2">
        <Link href="/" className="w-full">
          <Button variant={isActive("/") ? "default" : "ghost"} className="w-full justify-start" size="sm">
            <Home className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">בית</span>
          </Button>
        </Link>

        <Link href="/websites" className="w-full">
          <Button
            variant={pathname.includes("/websites") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <Code className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">אתרים</span>
          </Button>
        </Link>

        <Link href="/projects" className="w-full">
          <Button
            variant={pathname.includes("/projects") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <FolderIcon className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">פרויקטים</span>
          </Button>
        </Link>

        <Link href="/database" className="w-full">
          <Button
            variant={pathname.includes("/database") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">מסד נתונים</span>
          </Button>
        </Link>

        <Link href="/terminal" className="w-full">
          <Button
            variant={pathname.includes("/terminal") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <Terminal className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">טרמינל</span>
          </Button>
        </Link>

        <Link href="/memory" className="w-full">
          <Button
            variant={pathname.includes("/memory") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <Memory className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">זיכרון</span>
          </Button>
        </Link>

        <Link href="/settings" className="w-full">
          <Button
            variant={pathname.includes("/settings") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">הגדרות</span>
          </Button>
        </Link>

        {/* הוספת קישור לדף התחברות לגיטהאב בסוף הניווט, לפני הקישור לדף הניהול */}
        <Link href="/github-login" className="w-full">
          <Button
            variant={pathname.includes("/github-login") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <Github className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">גיטהאב</span>
          </Button>
        </Link>

        {!user ? (
          <Link href="/login" className="w-full">
            <Button
              variant={pathname.includes("/login") ? "default" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">התחברות</span>
            </Button>
          </Link>
        ) : null}

        <Link href="/admin" className="w-full">
          <Button
            variant={pathname.includes("/admin") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
          >
            <Lock className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">ניהול</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}

