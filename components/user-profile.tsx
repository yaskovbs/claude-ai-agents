"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"

export default function UserProfile() {
  const { user, profile } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
        <User className="h-4 w-4 mr-2" />
        התחברות
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.user_metadata?.avatar_url || ""} />
        <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
      </Avatar>
      <div className="hidden md:block">
        <p className="text-sm font-medium">{user.email}</p>
        <p className="text-xs text-gray-500">{profile?.full_name || "משתמש"}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

