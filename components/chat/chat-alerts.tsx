"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ChatAlertsProps {
  error: any
  reload: () => void
  apiKeyMissing: boolean
  useAdminKey: boolean
  hasSystemKey: boolean
  goToSettings: () => void
  currentAttachment: any
  setCurrentAttachment: (attachment: any) => void
}

export default function ChatAlerts({
  error,
  reload,
  apiKeyMissing,
  useAdminKey,
  hasSystemKey,
  goToSettings,
  currentAttachment,
  setCurrentAttachment,
}: ChatAlertsProps) {
  // Helper function to get error message as string
  const getErrorMessage = (error: any): string => {
    if (!error) return ""
    if (typeof error === "string") return error
    if (error instanceof Error) return error.message || "An error occurred"
    if (error.message && typeof error.message === "string") return error.message
    return "אירעה שגיאה. נסה שוב."
  }

  return (
    <>
      {apiKeyMissing && (
        <Alert className="bg-amber-50 border-amber-200 mb-4 dark:bg-amber-900 dark:border-amber-800 dark:text-amber-100">
          <AlertDescription className="text-amber-700 dark:text-amber-100">
            נדרש מפתח API של Anthropic כדי להשתמש בצ'אט.{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-amber-700 dark:text-amber-100 underline"
              onClick={goToSettings}
            >
              הוסף מפתח API
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {useAdminKey && (
        <Alert className="bg-blue-50 border-blue-200 mb-4 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-100">
          <AlertDescription className="text-blue-700 dark:text-blue-100">משתמש במפתח API של המנהל</AlertDescription>
        </Alert>
      )}

      {!apiKeyMissing && !useAdminKey && hasSystemKey && (
        <Alert className="bg-green-50 border-green-200 mb-4 dark:bg-green-900 dark:border-green-800 dark:text-green-100">
          <AlertDescription className="text-green-700 dark:text-green-100">משתמש במפתח API של המערכת</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200 mb-4 dark:bg-red-900 dark:border-red-800 dark:text-red-100">
          <AlertDescription className="text-red-700 dark:text-red-100">
            {getErrorMessage(error)}
            <Button
              variant="link"
              className="p-0 h-auto text-red-700 dark:text-red-100 underline ml-2"
              onClick={() => reload()}
            >
              נסה שוב
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {currentAttachment && currentAttachment.name && (
        <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900 rounded-md flex items-center">
          <span className="text-sm">קובץ מצורף: {currentAttachment.name}</span>
          <Button variant="ghost" size="sm" className="ml-auto h-6 px-2" onClick={() => setCurrentAttachment(null)}>
            הסר
          </Button>
        </div>
      )}
    </>
  )
}

