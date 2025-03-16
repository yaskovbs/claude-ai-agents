"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, X, DatabaseIcon, Table, FileText, RefreshCw } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export default function DatabasePage() {
  const router = useRouter()
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [databaseStats, setDatabaseStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // טעינת פרטי התחברות מ-localStorage
    const savedUrl = localStorage.getItem("supabaseUrl") || ""
    const savedKey = localStorage.getItem("supabaseKey") || ""

    setSupabaseUrl(savedUrl)
    setSupabaseKey(savedKey)

    // בדיקה אם יש פרטי התחברות שמורים
    if (savedUrl && savedKey) {
      setIsConnected(true)
      checkTablesAndFetchStats(savedUrl, savedKey)
    }
  }, [])

  const goToSettings = () => {
    router.push("/settings")
  }

  const connectToSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setConnectionStatus("error")
      setErrorMessage("נא להזין URL ומפתח API")
      return
    }

    // Validate URL format
    try {
      new URL(supabaseUrl)
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage("פורמט URL לא תקין")
      return
    }

    setIsConnecting(true)
    setConnectionStatus("idle")

    try {
      // יצירת לקוח Supabase לבדיקת החיבור
      const supabase = createClient(supabaseUrl, supabaseKey)

      // בדיקת החיבור על ידי ניסיון לקבל את גרסת PostgreSQL
      const { data, error } = await supabase.rpc("get_pg_version")

      if (error) throw error

      // שמירת פרטי ההתחברות ב-localStorage
      localStorage.setItem("supabaseUrl", supabaseUrl)
      localStorage.setItem("supabaseKey", supabaseKey)

      setConnectionStatus("success")
      setIsConnected(true)

      // קבלת נתונים על הטבלאות
      checkTablesAndFetchStats(supabaseUrl, supabaseKey)
    } catch (error) {
      console.error("Error connecting to Supabase:", error)
      setConnectionStatus("error")
      setErrorMessage("אירעה שגיאה בהתחברות ל-Supabase. בדוק את פרטי ההתחברות.")
    } finally {
      setIsConnecting(false)
    }
  }

  const checkTablesAndFetchStats = async (url: string, key: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient(url, key)

      // שימוש בשאילתה מתוקנת - הסרת התחילית 'public.'
      const { data: tables, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")

      if (tablesError) {
        // אם יש שגיאה בגישה ישירה לטבלה, ננסה שאילתת SQL
        const { data: sqlTables, error: sqlError } = await supabase.rpc("get_tables")

        if (sqlError) {
          throw new Error(sqlError.message)
        }

        // עיבוד הנתונים מהפונקציה המותאמת אישית
        setDatabaseStats({
          tables: sqlTables || [],
          totalTables: sqlTables?.length || 0,
          totalRows: 0, // לא ניתן לקבל בקלות ללא גישה ישירה
          size: "לא זמין", // לא ניתן לקבל בקלות ללא גישה ישירה
        })
      } else {
        // קבלת מספר השורות בכל טבלה
        let totalRows = 0
        for (const table of tables || []) {
          const { count, error: countError } = await supabase
            .from(table.table_name)
            .select("*", { count: "exact", head: true })

          if (!countError) {
            totalRows += count || 0
          }
        }

        setDatabaseStats({
          tables: tables || [],
          totalTables: tables?.length || 0,
          totalRows,
          size: "לא זמין", // קשה לקבל גודל מדויק דרך ה-API
        })
      }
    } catch (error) {
      console.error("Error checking tables and fetching stats:", error)
      setDatabaseStats(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStats = () => {
    if (supabaseUrl && supabaseKey) {
      checkTablesAndFetchStats(supabaseUrl, supabaseKey)
    }
  }

  const goToMemory = () => {
    router.push("/memory")
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold">חיבור ל-Supabase</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-6">
            {!isConnected ? (
              <>
                <div className="text-center">
                  <h3 className="text-xl font-bold">חיבור ל-Supabase</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    נהל את חיבור מסד הנתונים Supabase שלך ואחסון הזיכרון.
                  </p>
                </div>

                {connectionStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800">
                    <AlertDescription className="text-green-700 dark:text-green-100 flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      התחברות ל-Supabase בוצעה בהצלחה
                    </AlertDescription>
                  </Alert>
                )}

                {connectionStatus === "error" && (
                  <Alert className="bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800">
                    <AlertDescription className="text-red-700 dark:text-red-100 flex items-center">
                      <X className="h-4 w-4 mr-2" />
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="supabase-url" className="block text-sm font-medium mb-1">
                      Supabase URL
                    </label>
                    <Input
                      id="supabase-url"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="הזן את ה-URL של Supabase"
                    />
                  </div>

                  <div>
                    <label htmlFor="supabase-key" className="block text-sm font-medium mb-1">
                      Supabase API Key
                    </label>
                    <Input
                      id="supabase-key"
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="הזן את מפתח ה-API של Supabase"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <Button onClick={connectToSupabase} disabled={isConnecting} className="flex items-center">
                    {isConnecting ? (
                      <>
                        <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin" />
                        מתחבר...
                      </>
                    ) : (
                      <>
                        <DatabaseIcon className="h-4 w-4 mr-2" />
                        התחבר ל-Supabase
                      </>
                    )}
                  </Button>

                  <Button variant="outline" onClick={goToSettings}>
                    עבור להגדרות
                  </Button>

                  <Button variant="outline" onClick={goToMemory}>
                    נהל זיכרונות
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <h3 className="text-xl font-bold">מחובר ל-Supabase</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{supabaseUrl}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center">
                      <Table className="h-10 w-10 text-blue-500 mb-2" />
                      <h4 className="font-bold">טבלאות</h4>
                      <p className="text-2xl font-bold">{isLoading ? "..." : databaseStats?.totalTables || 0}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex flex-col items-center">
                      <FileText className="h-10 w-10 text-green-500 mb-2" />
                      <h4 className="font-bold">שורות</h4>
                      <p className="text-2xl font-bold">{isLoading ? "..." : databaseStats?.totalRows || 0}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex flex-col items-center">
                      <DatabaseIcon className="h-10 w-10 text-purple-500 mb-2" />
                      <h4 className="font-bold">גודל</h4>
                      <p className="text-2xl font-bold">{isLoading ? "..." : databaseStats?.size || "לא זמין"}</p>
                    </CardContent>
                  </Card>
                </div>

                {databaseStats?.tables && databaseStats.tables.length > 0 ? (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">טבלאות</h3>
                      <Button variant="outline" size="sm" onClick={refreshStats} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        רענן
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              שם הטבלה
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {databaseStats.tables.map((table: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {table.table_name}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-6">
                    <p className="text-gray-500 dark:text-gray-400">
                      {isLoading ? "טוען טבלאות..." : "אין טבלאות במסד הנתונים"}
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("supabaseUrl")
                      localStorage.removeItem("supabaseKey")
                      setIsConnected(false)
                      setDatabaseStats(null)
                    }}
                  >
                    התנתק
                  </Button>

                  <Button variant="outline" onClick={goToMemory}>
                    נהל זיכרונות
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

