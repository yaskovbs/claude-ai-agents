"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Code, Globe, Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [newProjectType, setNewProjectType] = useState("website")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    // טעינת פרויקטים מ-localStorage
    const savedProjects = localStorage.getItem("savedProjects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // פרויקטים לדוגמה
      const demoProjects = [
        {
          id: 1,
          name: "אתר תדמית",
          description: "אתר תדמית לחברה",
          type: "website",
          date: "2023-05-01",
        },
        {
          id: 2,
          name: "אפליקציית מטלות",
          description: "אפליקציה לניהול מטלות",
          type: "app",
          date: "2023-05-15",
        },
      ]
      setProjects(demoProjects)
      localStorage.setItem("savedProjects", JSON.stringify(demoProjects))
    }
  }, [])

  const deleteProject = (id: number) => {
    const updatedProjects = projects.filter((project) => project.id !== id)
    setProjects(updatedProjects)
    localStorage.setItem("savedProjects", JSON.stringify(updatedProjects))

    // הצגת הודעת הצלחה
    setAlertMessage({
      type: "success",
      message: "הפרויקט נמחק בהצלחה",
    })

    // הסרת ההודעה אחרי 3 שניות
    setTimeout(() => {
      setAlertMessage(null)
    }, 3000)
  }

  // עדכון פונקציית addProject כדי שתעבוד כראוי
  const addProject = () => {
    if (!newProjectName.trim()) {
      setAlertMessage({
        type: "error",
        message: "נא להזין שם לפרויקט",
      })

      setTimeout(() => {
        setAlertMessage(null)
      }, 3000)

      return
    }

    const newProject = {
      id: Date.now(),
      name: newProjectName,
      description: newProjectDescription || "אין תיאור",
      type: newProjectType,
      date: new Date().toISOString().split("T")[0],
    }

    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    localStorage.setItem("savedProjects", JSON.stringify(updatedProjects))

    setNewProjectName("")
    setNewProjectDescription("")
    setNewProjectType("website")
    setIsDialogOpen(false)

    // הצגת הודעת הצלחה
    setAlertMessage({
      type: "success",
      message: "הפרויקט נוצר בהצלחה",
    })

    // הסרת ההו��עה אחרי 3 שניות
    setTimeout(() => {
      setAlertMessage(null)
    }, 3000)

    // ניתוב לדף היצירה המתאים בהתאם לסוג הפרויקט
    if (newProjectType === "website") {
      router.push(`/websites/create-website?projectId=${newProject.id}`)
    } else {
      router.push(`/websites/create-app?projectId=${newProject.id}`)
    }
  }

  const goToWebsites = () => {
    router.push("/websites")
  }

  // עדכון פונקציית openProject כדי שתעבוד כראוי
  const openProject = (project: any) => {
    if (project.type === "website") {
      router.push(`/websites/create-website?projectId=${project.id}`)
    } else {
      router.push(`/websites/create-app?projectId=${project.id}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl md:text-2xl font-bold">פרויקטים שמורים</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Plus className="h-4 w-4 mr-2" />
                  פרויקט חדש
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>הוספת פרויקט חדש</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium mb-1">
                      שם הפרויקט
                    </label>
                    <Input
                      id="project-name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="הזן שם לפרויקט"
                    />
                  </div>
                  <div>
                    <label htmlFor="project-type" className="block text-sm font-medium mb-1">
                      סוג הפרויקט
                    </label>
                    <select
                      id="project-type"
                      value={newProjectType}
                      onChange={(e) => setNewProjectType(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="website">אתר</option>
                      <option value="app">אפליקציה</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="project-description" className="block text-sm font-medium mb-1">
                      תיאור
                    </label>
                    <Textarea
                      id="project-description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="הזן תיאור לפרויקט"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={addProject}>הוסף פרויקט</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {alertMessage && (
            <Alert
              className={`mb-4 ${alertMessage.type === "success" ? "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800" : "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800"}`}
            >
              <AlertDescription
                className={`${alertMessage.type === "success" ? "text-green-700 dark:text-green-100" : "text-red-700 dark:text-red-100"}`}
              >
                {alertMessage.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">אין פרויקטים שמורים</p>
                <Button className="mt-4" onClick={goToWebsites}>
                  צור פרויקט חדש
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          {project.type === "website" ? (
                            <Globe className="h-5 w-5 text-blue-500 mr-2" />
                          ) : (
                            <Code className="h-5 w-5 text-purple-500 mr-2" />
                          )}
                          <div>
                            <h3 className="font-bold">{project.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{project.date}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                      <div className="mt-4 flex justify-end">
                        <Button size="sm" onClick={() => openProject(project)}>
                          פתח פרויקט
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

