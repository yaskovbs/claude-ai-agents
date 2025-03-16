// מודלים זמינים של Claude
export const CLAUDE_MODELS = {
  // מודלים חדשים
  "claude-3-sonnet": {
    name: "Claude 3 Sonnet",
    description: "מודל מאוזן עם יכולות מתקדמות",
    isAvailable: true,
  },
  "claude-3-opus": {
    name: "Claude 3 Opus",
    description: "המודל החזק ביותר, מתאים למשימות מורכבות",
    isAvailable: true,
  },
  "claude-3-haiku": {
    name: "Claude 3 Haiku",
    description: "מודל מהיר וחסכוני",
    isAvailable: true,
  },
  // מודלים חדשים יותר (ייתכן שאינם זמינים לכל המשתמשים)
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    description: "גרסה משופרת של Claude 3 Sonnet",
    isAvailable: false,
  },
  "claude-3-5-haiku": {
    name: "Claude 3.5 Haiku",
    description: "גרסה משופרת של Claude 3 Haiku",
    isAvailable: false,
  },
  "claude-3-7-sonnet": {
    name: "Claude 3.7 Sonnet",
    description: "המודל החדש ביותר עם יכולות היברידיות",
    isAvailable: false, // שמור כ-false כי הוא לא זמין כרגע
  },
  "claude-3-sonnet": {
    name: "Claude 3 Sonnet",
    description: "מודל מאוזן עם יכולות מתקדמות",
    isAvailable: true,
  },
}

// פונקציה לבדיקת זמינות מודל
export async function checkModelAvailability(apiKey: string, modelName: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 10,
        messages: [{ role: "user", content: "Hello" }],
      }),
    })

    return response.ok
  } catch (error) {
    console.error(`Error checking model availability for ${modelName}:`, error)
    return false
  }
}

// פונקציה לקבלת מודל זמין
export async function getAvailableModel(apiKey: string, preferredModel = "claude-3-sonnet"): Promise<string> {
  // נסה קודם את המודל המועדף
  if (await checkModelAvailability(apiKey, preferredModel)) {
    return preferredModel
  }

  // אם המודל המועדף אינו זמין, נסה מודלים אחרים לפי סדר העדיפות
  const fallbackModels = ["claude-3-sonnet", "claude-3-opus", "claude-3-haiku"]

  for (const model of fallbackModels) {
    if (model !== preferredModel && (await checkModelAvailability(apiKey, model))) {
      return model
    }
  }

  // אם אף מודל אינו זמין, החזר את המודל הבסיסי ביותר
  return "claude-3-haiku"
}

