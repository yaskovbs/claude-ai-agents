import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { url, key } = await request.json()

    if (!url || !key) {
      return NextResponse.json({ error: "Missing Supabase URL or API key" }, { status: 400 })
    }

    const supabase = createClient(url, key)

    // שימוש בשאילתת SQL ישירה לקבלת רשימת הטבלאות
    const { data, error } = await supabase.rpc("get_tables")

    if (error) {
      // אם הפונקציה לא קיימת, ננסה ליצור אותה
      const createFunctionResult = await supabase.rpc("create_get_tables_function")

      if (createFunctionResult.error) {
        // אם לא ניתן ליצור את הפונקציה, ננסה שאילתת SQL ישירה
        const { data: sqlData, error: sqlError } = await supabase
          .from("pg_tables")
          .select("tablename")
          .eq("schemaname", "public")

        if (sqlError) {
          return NextResponse.json({ error: sqlError.message }, { status: 500 })
        }

        return NextResponse.json({ tables: sqlData })
      }

      // נסה שוב לאחר יצירת הפונקציה
      const { data: retryData, error: retryError } = await supabase.rpc("get_tables")

      if (retryError) {
        return NextResponse.json({ error: retryError.message }, { status: 500 })
      }

      return NextResponse.json({ tables: retryData })
    }

    return NextResponse.json({ tables: data })
  } catch (error: any) {
    console.error("Error fetching tables:", error)
    return NextResponse.json({ error: error.message || "Error fetching tables" }, { status: 500 })
  }
}

