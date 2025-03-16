import { NextResponse } from "next/server"

// הגדרת סביבת הריצה ל-nodejs
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages, apiKey } = await req.json()

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Format messages for Claude API
    const formattedMessages = messages.map((msg) => {
      // Ensure role is a string and has a valid value
      const role = typeof msg.role === "string" ? msg.role.toLowerCase() : "user"

      // Ensure content is a string
      const content = typeof msg.content === "string" ? msg.content : msg.content ? String(msg.content) : ""

      return {
        role: role === "assistant" ? "assistant" : "user",
        content: content,
      }
    })

    // השתמש במודל Claude 3.7 Sonnet
    const modelToUse = "claude-3-sonnet" // נשתמש במודל זמין במקום
    console.log(`Sending request to Claude API with model: ${modelToUse}`)

    // נסה עם המפתח הראשון
    let anthropicApiKey = process.env.ANTHROPIC_API_KEY || ""

    // שימוש ב-fetch ישירות במקום ב-SDK של Anthropic
    let response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelToUse,
        max_tokens: 4000,
        messages: formattedMessages,
        temperature: 0.7,
      }),
    })

    // אם המפתח הראשון נכשל, נסה עם המפתח השני
    if (!response.ok) {
      console.log("First API key failed, trying backup key...")

      // השתמש במפתח הגיבוי
      anthropicApiKey = process.env.ANTHROPIC_API_KEY_BACKUP || ""

      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: modelToUse,
          max_tokens: 4000,
          messages: formattedMessages,
          temperature: 0.7,
        }),
      })
    }

    // בדיקה אם התגובה תקינה
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Claude API error:", errorData)

      // Log more details about the error
      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // אם יש שגיאת מכסה או שגיאת מודל לא נמצא, נסה מודל אחר
      if (
        response.status === 429 ||
        response.status === 404 ||
        errorData.error?.type === "rate_limit_error" ||
        errorData.error?.type === "not_found_error"
      ) {
        console.log("Model error or rate limit reached, trying alternative model...")

        // נסה מודל אחר
        const alternativeModel = "claude-3-sonnet"
        console.log(`Trying alternative model: ${alternativeModel}`)

        const alternativeResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: alternativeModel,
            max_tokens: 4000,
            messages: formattedMessages,
            temperature: 0.7,
          }),
        })

        if (!alternativeResponse.ok) {
          const altErrorData = await alternativeResponse.json().catch(() => ({}))
          console.error("Alternative model error:", altErrorData)

          // נסה מודל שלישי
          const lastResortModel = "claude-3-haiku"
          console.log(`Trying last resort model: ${lastResortModel}`)

          const lastResortResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": anthropicApiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: lastResortModel,
              max_tokens: 4000,
              messages: formattedMessages,
              temperature: 0.7,
            }),
          })

          if (!lastResortResponse.ok) {
            const lastErrorData = await lastResortResponse.json().catch(() => ({}))
            console.error("Last resort model error:", lastErrorData)
            return NextResponse.json(
              { error: `נראה שהגעת למגבלת השימוש היומית. נסה שוב מחר או השתמש במפתח API אחר.` },
              { status: 429 },
            )
          }

          // קריאת התגובה מהמודל השלישי והחזרתה
          const lastResortData = await lastResortResponse.json()
          return NextResponse.json(lastResortData)
        }

        // קריאת התגובה מהמודל השני והחזרתה
        const alternativeData = await alternativeResponse.json()
        return NextResponse.json(alternativeData)
      }

      return NextResponse.json(
        { error: `Error from Claude API: ${errorData.error?.message || response.statusText || "Unknown error"}` },
        { status: response.status },
      )
    }

    // קריאת התגובה והחזרתה
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error calling Claude API:", error)
    return NextResponse.json(
      { error: `Error calling Claude API: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}
