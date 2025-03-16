"use client"

import { Button } from "@/components/ui/button"

interface DatabaseTabProps {
  goToSettings: () => void
}

export default function DatabaseTab({ goToSettings }: DatabaseTabProps) {
  return (
    <div className="p-4">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold">חיבור ל-Supabase</h3>
        <p>נהל את חיבור מסד הנתונים Supabase שלך ואחסון הזיכרון.</p>
        <Button className="mt-4" onClick={goToSettings}>
          התחבר ל-Supabase
        </Button>
      </div>
    </div>
  )
}

