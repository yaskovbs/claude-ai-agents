import { NextResponse } from "next/server"

// הגדרת סביבת הריצה ל-nodejs
export const runtime = "nodejs"

export async function GET() {
  try {
    // בדוק אם יש מפתח API זמין
    const hasSystemKey = !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY_BACKUP)

    // בדוק אם יש מפתח גיבוי
    const hasBackupKey = !!process.env.ANTHROPIC_API_KEY_BACKUP

    // החזר את התוצאה
    return NextResponse.json({
      hasSystemKey,
      hasBackupKey,
    })
  } catch (error) {
    console.error("Error checking system key:", error)
    return NextResponse.json({ hasSystemKey: false, hasBackupKey: false }, { status: 500 })
  }
}

