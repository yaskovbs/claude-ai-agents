"use client"

import { Card } from "@/components/ui/card"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface WebsitesTabProps {
  router: AppRouterInstance
}

export default function WebsitesTab({ router }: WebsitesTabProps) {
  return (
    <div className="p-4">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold">יצירת אתרים ואפליקציות</h3>
        <p>צור אתרים ואפליקציות באמצעות יכולות ה-AI של Claude.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/websites?tab=website")}
          >
            <div className="p-6 text-center">
              <h4 className="font-bold mb-2">צור אתר</h4>
              <p className="text-sm text-gray-500">צור אתר שלם מתיאור שלך</p>
            </div>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/websites?tab=app")}
          >
            <div className="p-6 text-center">
              <h4 className="font-bold mb-2">צור אפליקציה</h4>
              <p className="text-sm text-gray-500">בנה אפליקציה למובייל או לווב</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

