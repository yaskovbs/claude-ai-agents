import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { prompt, apiKey, attachment } = await request.json()

    // בדיקה אם יש API key
    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // בדיקה אם להשתמש במפתח המערכת
    let actualApiKey = apiKey
    if (apiKey === "system_key") {
      actualApiKey = process.env.ANTHROPIC_API_KEY || ""
      if (!actualApiKey) {
        return NextResponse.json({ error: "System API key is not available" }, { status: 500 })
      }
    }

    // יצירת מופע של Anthropic עם ה-API key
    const anthropic = new Anthropic({
      apiKey: actualApiKey,
      dangerouslyAllowBrowser: true, // מאפשר שימוש בסביבת דפדפן
    })

    // הכנת הפרומפט עם מידע על הקובץ המצורף אם יש
    let fullPrompt = prompt || ""
    if (attachment && typeof attachment === "object") {
      // Add null checks for attachment properties
      const fileTypeInfo = attachment.fileType ? `(סוג: ${attachment.fileType})` : ""
      const fileName = attachment.name || "קובץ"
      fullPrompt += `\n\n[מצורף קובץ: ${fileName} ${fileTypeInfo}]`
    }

    // שליחת בקשה לאנתרופיק
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `צור קוד HTML, CSS ו-JavaScript לאתר בהתאם לתיאור הבא: ${fullPrompt}. 
        הקוד צריך להיות מלא ומוכן להרצה. השתמש בעברית בממשק המשתמש.`,
        },
      ],
      system: `אתה מומחה לפיתוח אתרים. תפקידך ליצור קוד HTML, CSS ו-JavaScript מלא ומוכן להרצה בהתאם לתיאור שהמשתמש מספק.
    הקוד צריך להיות מותאם לעברית (dir="rtl") ולכלול את כל הסגנונות והפונקציונליות הנדרשים.
    אם המשתמש מצרף קובץ, התייחס אליו בתשובתך ונסה להשתמש במידע שבו.
    החזר רק את הקוד המלא ללא הסברים נוספים.`,
    })

    // חילוץ הקוד מהתשובה
    const generatedCode = response.content[0]?.text || ""

    // החזרת התשובה
    return NextResponse.json({ generatedCode })
  } catch (error: any) {
    console.error("Error generating website:", error)

    return NextResponse.json(
      {
        error: error.message || "Error generating website",
        details: error.response?.data || error,
      },
      { status: 500 },
    )
  }
}

