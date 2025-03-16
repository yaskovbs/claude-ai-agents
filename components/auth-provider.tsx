"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase, checkUserSession } from "@/lib/supabase"

const AuthContext = createContext<{
  user: any | null
  profile: any | null
  setUser: (user: any | null) => void
  setProfile: (profile: any | null) => void
}>({
  user: null,
  profile: null,
  setUser: () => {},
  setProfile: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await checkUserSession()
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  useEffect(() => {
    // Only set up auth listener if supabase client exists
    if (!supabase) {
      console.warn("Supabase client not available for auth listener")
      return
    }

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user)

        // Try to get user profile if user exists
        if (session.user && supabase) {
          try {
            const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

            if (profileData) {
              setProfile(profileData)
            }
          } catch (error) {
            console.error("Error fetching profile:", error)
          }
        }
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, setUser, setProfile }}>{!isLoading && children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

