"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, X, FileCode, FileImage, FileText, File } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Simple implementation of LazyTextEnhancer
export function LazyTextEnhancer({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">שיפור טקסט</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="הכנס טקסט לשיפור..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button>שפר טקסט</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced implementation of LazyFileUpload with support for different file types
export function LazyFileUpload({
  onFileUpload,
  onCancel,
}: {
  onFileUpload: (file: File, fileType: string) => void
  onCancel: () => void
}) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const fileTypeAccept = {
    all: ".pdf,.png,.jpg,.jpeg,.txt,.js,.ts,.jsx,.tsx,.html,.css,.json,.md,.py,.java,.c,.cpp,.rb,.php,.go,.swift,.kt",
    image: ".png,.jpg,.jpeg,.gif,.svg,.webp",
    code: ".js,.ts,.jsx,.tsx,.html,.css,.json,.md,.py,.java,.c,.cpp,.rb,.php,.go,.swift,.kt",
    document: ".pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.md",
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      setIsUploading(true)

      // Determine file type category
      let fileType = "other"
      const fileName = selectedFile.name || ""
      const ext = fileName.split(".").pop() || ""

      // Make sure ext is a string before calling toLowerCase
      const lowerExt = typeof ext === "string" ? (typeof ext === "string" ? ext.toLowerCase() : "") : ""

      if (lowerExt && /^(png|jpg|jpeg|gif|svg|webp)$/.test(lowerExt)) {
        fileType = "image"
      } else if (lowerExt && /^(js|ts|jsx|tsx|html|css|json|md|py|java|c|cpp|rb|php|go|swift|kt)$/.test(lowerExt)) {
        fileType = "code"
      } else if (lowerExt && /^(pdf|txt|doc|docx|xls|xlsx|ppt|pptx)$/.test(lowerExt)) {
        fileType = "document"
      }

      // Simulate upload delay
      setTimeout(() => {
        onFileUpload(selectedFile, fileType)
        setIsUploading(false)
      }, 500)
    }
  }

  const getFileIcon = () => {
    if (!selectedFile) return <File className="h-16 w-16 text-gray-400" />

    const fileName = selectedFile.name || ""
    const ext = fileName.split(".").pop() || ""

    // Make sure ext is a string before calling toLowerCase
    const lowerExt = typeof ext === "string" ? (typeof ext === "string" ? ext.toLowerCase() : "") : ""

    if (lowerExt && /^(png|jpg|jpeg|gif|svg|webp)$/.test(lowerExt)) {
      return <FileImage className="h-16 w-16 text-blue-500" />
    } else if (lowerExt && /^(js|ts|jsx|tsx|html|css|json|md|py|java|c|cpp|rb|php|go|swift|kt)$/.test(lowerExt)) {
      return <FileCode className="h-16 w-16 text-purple-500" />
    } else if (lowerExt && /^(pdf|txt|doc|docx|xls|xlsx|ppt|pptx)$/.test(lowerExt)) {
      return <FileText className="h-16 w-16 text-green-500" />
    }

    return <File className="h-16 w-16 text-gray-400" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">העלאת קובץ</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">הכל</TabsTrigger>
            <TabsTrigger value="image">תמונות</TabsTrigger>
            <TabsTrigger value="code">קוד</TabsTrigger>
            <TabsTrigger value="document">מסמכים</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              <div
                className={`flex flex-col items-center justify-center w-full h-40 border-2 ${isDragging ? "border-primary bg-primary/10" : "border-dashed bg-gray-50 dark:bg-gray-800"} rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    {getFileIcon()}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">לחץ להעלאה</span> או גרור קובץ לכאן
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">תמונות, קבצי קוד, PDF ומסמכים (עד 10MB)</p>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={fileTypeAccept[activeTab as keyof typeof fileTypeAccept]}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel} disabled={isUploading}>
                  ביטול
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      מעלה...
                    </>
                  ) : (
                    "העלה קובץ"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* תוכן זהה לכל הטאבים, רק ה-accept משתנה */}
          <TabsContent value="image" className="mt-0">
            <div className="space-y-4">
              {/* תוכן זהה לטאב "הכל" */}
              <div
                className={`flex flex-col items-center justify-center w-full h-40 border-2 ${isDragging ? "border-primary bg-primary/10" : "border-dashed bg-gray-50 dark:bg-gray-800"} rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload-image")?.click()}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    {getFileIcon()}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileImage className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">לחץ להעלאת תמונה</span> או גרור לכאן
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, SVG, WEBP (עד 10MB)</p>
                  </div>
                )}
                <input
                  id="file-upload-image"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={fileTypeAccept.image}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel} disabled={isUploading}>
                  ביטול
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      מעלה...
                    </>
                  ) : (
                    "העלה תמונה"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-0">
            <div className="space-y-4">
              <div
                className={`flex flex-col items-center justify-center w-full h-40 border-2 ${isDragging ? "border-primary bg-primary/10" : "border-dashed bg-gray-50 dark:bg-gray-800"} rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload-code")?.click()}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    {getFileIcon()}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileCode className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">לחץ להעלאת קובץ קוד</span> או גרור לכאן
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      JS, TS, JSX, TSX, HTML, CSS, JSON, MD, PY ועוד (עד 10MB)
                    </p>
                  </div>
                )}
                <input
                  id="file-upload-code"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={fileTypeAccept.code}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel} disabled={isUploading}>
                  ביטול
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      מעלה...
                    </>
                  ) : (
                    "העלה קובץ קוד"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="document" className="mt-0">
            <div className="space-y-4">
              <div
                className={`flex flex-col items-center justify-center w-full h-40 border-2 ${isDragging ? "border-primary bg-primary/10" : "border-dashed bg-gray-50 dark:bg-gray-800"} rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload-document")?.click()}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    {getFileIcon()}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">לחץ להעלאת מסמך</span> או גרור לכאן
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, TXT, DOC, DOCX, XLS, XLSX (עד 10MB)</p>
                  </div>
                )}
                <input
                  id="file-upload-document"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={fileTypeAccept.document}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel} disabled={isUploading}>
                  ביטול
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      מעלה...
                    </>
                  ) : (
                    "העלה מסמך"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Placeholder for other components that might be imported elsewhere
export const LazyWebsiteGenerator = () => <div>Website Generator</div>
export const LazyAppGenerator = () => <div>App Generator</div>
export const LazyWebsiteGeneratorChat = () => <div>Website Generator Chat</div>
export const LazyAppGeneratorChat = () => <div>App Generator Chat</div>
export const LazyMemoryManager = () => <div>Memory Manager</div>
export const LazyTerminal = () => <div>Terminal</div>
export const LazySavedProjects = () => <div>Saved Projects</div>

// Loading component
export function LoadingComponent() {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

