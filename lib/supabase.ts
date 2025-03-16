import { createClient } from "@supabase/supabase-js"

// Create Supabase client with proper validation
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if both URL and key are valid strings
  if (
    typeof supabaseUrl === "string" &&
    supabaseUrl.trim() !== "" &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.trim() !== ""
  ) {
    try {
      // Validate URL format
      new URL(supabaseUrl)

      // Create and return client
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
        },
      })
    } catch (error) {
      console.error("Invalid Supabase URL format:", error)
      return null
    }
  }

  console.warn("Supabase client not initialized: Missing or invalid environment variables")
  return null
}

// Initialize the client
export const supabase = createSupabaseClient()

// Function to check user session
export async function checkUserSession() {
  if (!supabase) {
    return null
  }
  try {
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error("Error checking session:", error)
    return null
  }
}

// Function to sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    return { error: { message: "Supabase client not initialized. Check your environment variables." } }
  }
  try {
    return await supabase.auth.signInWithPassword({ email, password })
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: { message: "Error signing in. Please try again." } }
  }
}

// Function to sign up with email and password
export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) {
    return { error: { message: "Supabase client not initialized. Check your environment variables." } }
  }
  try {
    return await supabase.auth.signUp({ email, password })
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: { message: "Error signing up. Please try again." } }
  }
}

// Function to sign in with Google
export async function signInWithGoogle() {
  if (!supabase) {
    return { error: { message: "Supabase client not initialized. Check your environment variables." } }
  }
  try {
    return await supabase.auth.signInWithOAuth({ provider: "google" })
  } catch (error) {
    console.error("Google sign in error:", error)
    return { error: { message: "Error signing in with Google. Please try again." } }
  }
}

// Function to sign out
export async function signOut() {
  if (!supabase) {
    return { error: { message: "Supabase client not initialized. Check your environment variables." } }
  }
  try {
    return await supabase.auth.signOut()
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: { message: "Error signing out. Please try again." } }
  }
}

// Function to get current user
export async function getCurrentUser() {
  if (!supabase) {
    return null
  }
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

