"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Link2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TaskDetailHeaderProps {
  taskId: string
  title: string
  taskNumber: string
}

export function TaskDetailHeader({ taskId, title, taskNumber }: TaskDetailHeaderProps) {
  const router = useRouter()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/tasks/${taskId}`)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
        <Badge variant="outline" className="font-mono text-xs">
          {taskNumber}
        </Badge>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/tasks/${taskId}/edit`}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          <Link2 className="h-4 w-4 mr-1" />
          Copy Link
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  )
}
