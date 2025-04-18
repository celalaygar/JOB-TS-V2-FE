"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, File, Paperclip, Download, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"

interface IssueAttachmentsProps {
  issueId: string
}

export function IssueAttachments({ issueId }: IssueAttachmentsProps) {
  const [attachments, setAttachments] = useState([
    {
      id: "attachment-1",
      name: "screenshot.png",
      type: "image/png",
      size: 1024 * 1024 * 2.3, // 2.3 MB
      url: "/placeholder.svg?height=800&width=1200",
      uploadedBy: "John Smith",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
    {
      id: "attachment-2",
      name: "requirements.pdf",
      type: "application/pdf",
      size: 1024 * 1024 * 1.5, // 1.5 MB
      url: "#",
      uploadedBy: "Sarah Miller",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    },
    {
      id: "attachment-3",
      name: "error_log.txt",
      type: "text/plain",
      size: 1024 * 512, // 512 KB
      url: "#",
      uploadedBy: "David Chen",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
  ])

  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDeleteAttachment = () => {
    if (fileToDelete) {
      setAttachments(attachments.filter((a) => a.id !== fileToDelete))
      setFileToDelete(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    // In a real implementation, you would upload the files here
    // For demo purposes, we'll just show a message
    if (e.dataTransfer.files.length > 0) {
      alert(`${e.dataTransfer.files.length} file(s) would be uploaded in a real implementation`)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (type === "application/pdf") return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  return (
    <div className="space-y-4">
      {/* File upload area */}
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center ${
          isDragging ? "border-[var(--fixed-primary)] bg-[var(--fixed-primary)]/5" : "border-[var(--fixed-card-border)]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Paperclip className="h-8 w-8 mx-auto mb-2 text-[var(--fixed-sidebar-muted)]" />
        <p className="text-sm mb-2">Drag and drop files here, or click to browse</p>
        <Button variant="outline" className="border-[var(--fixed-card-border)]">
          Choose Files
        </Button>
      </div>

      {/* Attachments list */}
      {attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 border rounded-md border-[var(--fixed-card-border)]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[var(--fixed-secondary)] p-2 rounded-md">{getFileIcon(attachment.type)}</div>
                <div>
                  <div className="font-medium text-sm">{attachment.name}</div>
                  <div className="text-xs text-[var(--fixed-sidebar-muted)]">
                    {formatFileSize(attachment.size)} • Uploaded by {attachment.uploadedBy}{" "}
                    {formatDistanceToNow(new Date(attachment.uploadedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={attachment.url} download={attachment.name} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </a>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a href={attachment.url} download={attachment.name} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-[var(--fixed-danger)]"
                      onClick={() => setFileToDelete(attachment.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[var(--fixed-sidebar-muted)]">No attachments yet.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Attachment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this attachment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDeleteAttachment}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
