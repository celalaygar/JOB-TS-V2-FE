"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CheckCircle, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useState } from "react"
import { CompleteSprintDialog } from "./complete-sprint-dialog"

interface SprintDetailHeaderProps {
  sprint: any // Using any for simplicity, but should be properly typed
  tasks: any[] // Using any for simplicity, but should be properly typed
  onEdit: () => void
  onDelete: () => void
}

export function SprintDetailHeader({ sprint, tasks, onEdit, onDelete }: SprintDetailHeaderProps) {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>
      case "planned":
        return (
          <Badge variant="outline" className="border-[var(--fixed-card-border)]">
            Planned
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild className="border-[var(--fixed-card-border)]">
          <Link href="/project-sprints">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sprints
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {sprint.status.toLowerCase() === "active" && (
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => setIsCompleteDialogOpen(true)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete Sprint
            </Button>
          )}
          <Button variant="outline" size="sm" className="border-[var(--fixed-card-border)]" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--fixed-danger)] text-[var(--fixed-danger)]"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{sprint.name}</h1>
          {getStatusBadge(sprint.status)}
        </div>
        <div className="flex items-center text-[var(--fixed-sidebar-muted)] mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {format(new Date(sprint.startDate), "MMM d, yyyy")} - {format(new Date(sprint.endDate), "MMM d, yyyy")}
          </span>
        </div>
      </div>

      {/* Complete Sprint Dialog */}
      <CompleteSprintDialog
        sprintId={sprint.id}
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
        tasks={tasks}
      />
    </div>
  )
}
