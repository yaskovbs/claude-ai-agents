"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function MemoryPage() {
  const router = useRouter()
  const [memories, setMemories] = useState([
    { id: 1, title: "זיכרון 1", content: "זה תוכן של זיכרון לדוגמה", date: "2023-04-01" },
    { id: 2, title: "זיכרון 2", content: "זה תוכן של זיכרון נוסף לדוגמה", date: "2023-04-02" },
  ])
  const [newMemoryTitle, setNewMemoryTitle] = useState("")
  const [newMemoryContent, setNewMemoryContent] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const deleteMemory = (id: number) => {
    setMemories(memories.filter((memory) => memory.id !== id))
  }

  const addMemory = () => {
    if (!newMemoryTitle.trim() || !newMemoryContent.trim()) return

    const newMemory = {
      id: Date.now(),
      title: newMemoryTitle,
      content: newMemoryContent,
      date: new Date().toISOString().split("T")[0],
    }

    setMemories([...memories, newMemory])
    setNewMemoryTitle("")
    setNewMemoryContent("")
    setIsDialogOpen(false)
  }

  const goToChat = () => {
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl font-bold">ניהול זיכרון</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">זיכרונות שמורים</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    הוסף זיכרון
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>הוספת זיכרון חדש</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="memory-title" className="block text-sm font-medium mb-1">
                        כותרת
                      </label>
                      <Input
                        id="memory-title"
                        value={newMemoryTitle}
                        onChange={(e) => setNewMemoryTitle(e.target.value)}
                        placeholder="הזן כותרת לזיכרון"
                      />
                    </div>
                    <div>
                      <label htmlFor="memory-content" className="block text-sm font-medium mb-1">
                        תוכן
                      </label>
                      <Textarea
                        id="memory-content"
                        value={newMemoryContent}
                        onChange={(e) => setNewMemoryContent(e.target.value)}
                        placeholder="הזן את תוכן הזיכרון"
                        rows={5}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={addMemory}>הוסף זיכרון</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {memories.length === 0 ? (
              <p className="text-center text-gray-500">אין זיכרונות שמורים</p>
            ) : (
              <div className="space-y-4">
                {memories.map((memory) => (
                  <div key={memory.id} className="border rounded-lg p-4 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">{memory.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{memory.date}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => deleteMemory(memory.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{memory.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Button onClick={goToChat}>חזור לצ'אט</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

