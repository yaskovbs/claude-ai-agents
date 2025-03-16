"use client"

import { FileCode, FileText, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ChatMessageContentProps {
  content: any
  attachment?: {
    type?: string
    url?: string
    name?: string
    fileType?: string
  } | null
  isUser: boolean
}

export default function ChatMessageContent({ content, attachment, isUser }: ChatMessageContentProps) {
  // Helper function to safely convert content to string
  const getContentAsString = (content: any): string => {
    if (content === null || content === undefined) return ""
    if (typeof content === "string") return content
    if (typeof content === "number" || typeof content === "boolean") return String(content)
    if (content instanceof Error) return content.message || "Error"
    if (typeof content === "object") {
      // If it's an object with a toString method, use it
      if (content.toString !== Object.prototype.toString) {
        return content.toString()
      }
      // Otherwise, try to JSON stringify it
      try {
        return JSON.stringify(content)
      } catch (e) {
        return "[Object]"
      }
    }
    return String(content)
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Function to render different file types
  const renderAttachment = () => {
    if (!attachment) return null

    // For images
    if (
      (attachment?.type && typeof attachment.type === "string" && attachment.type.startsWith("image/")) ||
      attachment?.fileType === "image"
    ) {
      return (
        <div className="mt-2">
          <img
            src={attachment.url || "/placeholder.svg"}
            alt={attachment.name || "Attachment"}
            className="max-w-full h-auto rounded cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{attachment.name || "Attachment"}</div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{attachment.name || "Image"}</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center">
                <img
                  src={attachment.url || "/placeholder.svg"}
                  alt={attachment.name || "Attachment"}
                  className="max-w-full max-h-[70vh]"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
    }

    // For code files
    else if (attachment?.fileType === "code") {
      return (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
          <div className="flex items-center">
            <FileCode className="h-5 w-5 text-purple-500 mr-2" />
            <div className="text-sm">{attachment.name || "Code File"}</div>
          </div>
          <div className="mt-2 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => attachment.url && window.open(attachment.url, "_blank")}>
              פתח קובץ
            </Button>
          </div>
        </div>
      )
    }

    // For document files
    else if (
      attachment?.fileType === "document" ||
      (attachment?.type && typeof attachment.type === "string" && attachment.type.includes("pdf"))
    ) {
      return (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-green-500 mr-2" />
            <div className="text-sm">{attachment.name || "Document"}</div>
          </div>
          <div className="mt-2 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => attachment.url && window.open(attachment.url, "_blank")}>
              פתח מסמך
            </Button>
          </div>
        </div>
      )
    }

    // For other files
    else {
      return (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded border">
          <div className="flex items-center">
            <File className="h-5 w-5 text-blue-500 mr-2" />
            <div className="text-sm">{attachment.name || "File"}</div>
          </div>
          <div className="mt-2 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => attachment.url && window.open(attachment.url, "_blank")}>
              פתח קובץ
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <div
      className={`px-4 py-3 rounded-2xl ${isUser ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 dark:text-gray-100"}`}
    >
      <div className="whitespace-pre-wrap">{getContentAsString(content)}</div>
      {attachment && renderAttachment()}
    </div>
  )
}

