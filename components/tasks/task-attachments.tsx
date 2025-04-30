"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileIcon, ImageIcon, PlusIcon, TrashIcon, UploadCloudIcon } from "lucide-react"

interface Attachment {
  id: string
  name: string
  size: string
  type: string
  url: string
  uploadedAt: string
}

interface TaskAttachmentsProps {
  taskId?: string
  attachments?: Attachment[]
}

export function TaskAttachments({ taskId, attachments = [] }: TaskAttachmentsProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [deletedIds, setDeletedIds] = useState<string[]>([])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDelete = (id: string) => {
    // Delete from uploadedFiles or mark mock data as deleted
    if (id.startsWith("uploaded-")) {
      const index = parseInt(id.split("-")[1])
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    } else {
      setDeletedIds((prev) => [...prev, id])
    }
  }

  const mockAttachments: Attachment[] = [
    {
      id: "1",
      name: "screenshot.png",
      size: "1.2 MB",
      type: "image/png",
      url: "/placeholder.svg?height=200&width=300",
      uploadedAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      name: "requirements.pdf",
      size: "3.5 MB",
      type: "application/pdf",
      url: "#",
      uploadedAt: "2023-05-14T14:20:00Z",
    },
  ]

  const formattedUploaded = uploadedFiles.map((file, idx) => ({
    id: `uploaded-${idx}`,
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    type: file.type,
    url: "", // You can use URL.createObjectURL(file) for real preview
    uploadedAt: new Date().toISOString(),
  }))

  const displayAttachments: Attachment[] =
    attachments.length > 0 || uploadedFiles.length > 0
      ? [...formattedUploaded, ...(attachments as Attachment[])]
      : mockAttachments

  const visibleAttachments = displayAttachments.filter(
    (attachment) => !deletedIds.includes(attachment.id)
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={preventDefaults}
        className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col justify-center items-center text-center bg-gray-50 hover:border-primary transition"
      >
        <UploadCloudIcon className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-gray-600 font-medium">Drag & Drop files here</p>
        <p className="text-sm text-gray-500 mt-1">or click below to browse</p>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="fileUpload"
        />
        <label htmlFor="fileUpload">
          <Button className="mt-4" size="sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Browse Files
          </Button>
        </label>
      </div>

      {/* Attachment List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Uploaded Attachments</h3>
        {visibleAttachments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleAttachments.map((attachment) => (
              <Card key={attachment.id} className="p-4 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {attachment.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                    ) : (
                      <FileIcon className="h-5 w-5 mr-2 text-gray-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                {attachment.type.startsWith("image/") && attachment.url && (
                  <div className="mt-2 rounded-md overflow-hidden">
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt={attachment.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <div className="mt-auto pt-2 text-xs text-gray-500">
                  Uploaded on {new Date(attachment.uploadedAt).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No attachments yet</p>
        )}
      </div>
    </div>
  )
}
