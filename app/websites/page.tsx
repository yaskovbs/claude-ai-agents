"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function WebsitesPage() {
  const [activeTab, setActiveTab] = useState("website")
  const router = useRouter()

  // פונקציות לטיפול בלחיצות על כפתורים
  const handleCreateWebsite = () => {
    // בשלב זה, נעבור לדף יצירת אתר
    router.push("/websites/create-website")
  }

  const handleCreateApp = () => {
    // בשלב זה, נעבור לדף יצירת אפליקציה
    router.push("/websites/create-app")
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold">יצירת אתרים ואפליקציות</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="website" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="website">אתר</TabsTrigger>
              <TabsTrigger value="app">אפליקציה</TabsTrigger>
            </TabsList>

            <TabsContent value="website" className="mt-4">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">צור אתר</h3>
                <p>צור אתר שלם מתיאור שלך באמצעות Claude 3.7</p>
                <Button className="mt-4" onClick={handleCreateWebsite}>
                  התחל ביצירת אתר
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="app" className="mt-4">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">צור אפליקציה</h3>
                <p>בנה אפליקציה למובייל או לווב באמצעות Claude 3.7</p>
                <Button className="mt-4" onClick={handleCreateApp}>
                  התחל ביצירת אפליקציה
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

