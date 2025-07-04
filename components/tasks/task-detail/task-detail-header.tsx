"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectTask } from "@/types/task"
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface TaskDetailHeaderProps {
  projectTask: ProjectTask | null
  onEdit: () => void
  onCreateSubtask: () => void
}

export function TaskDetailHeader({ projectTask, onEdit, onCreateSubtask }: TaskDetailHeaderProps) {
  const router = useRouter()
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{projectTask?.title}</h1>
        <Badge variant="outline" className="font-mono text-xs">
          {projectTask?.taskNumber}
        </Badge>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onCreateSubtask}>
          <Plus className="h-4 w-4 mr-1" />
          Create Subtask
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  )
}
