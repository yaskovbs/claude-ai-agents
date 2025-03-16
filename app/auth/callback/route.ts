import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Validate Supabase credentials
    if (
      typeof supabaseUrl === "string" &&
      supabaseUrl.trim() !== "" &&
      typeof supabaseAnonKey === "string" &&
      supabaseAnonKey.trim() !== ""
    ) {
      try {
        // Validate URL format
        new URL(supabaseUrl)

        // Create client and exchange code for session
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        await supabase.auth.exchangeCodeForSession(code)
      } catch (error) {
        console.error("Error in auth callback:", error)
      }
    } else {
      console.error("Invalid Supabase credentials in auth callback")
    }
  }

  // Redirect to home page
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}

