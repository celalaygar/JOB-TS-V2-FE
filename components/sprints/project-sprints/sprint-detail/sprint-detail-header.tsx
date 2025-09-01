"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CheckCircle, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useState } from "react"
import { CompleteSprintDialog } from "./complete-sprint-dialog"
import { Sprint, SprintStatus } from "@/types/sprint"
import { useLanguage } from "@/lib/i18n/context"
import { ChangeSprintStatusDailog } from "./change-sprint-status-dialog"
import { RootState } from "@/lib/redux/store"
import { useSelector } from "react-redux"

interface SprintDetailHeaderProps {
  tasks: any[] // Using any for simplicity, but should be properly typed
  onEdit: () => void
  onDelete: () => void
  fetchData?: () => void
}

export function SprintDetailHeader({ tasks, onEdit, onDelete, fetchData }: SprintDetailHeaderProps) {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [changeSprintStatusDialogOpen, setChangeSprintStatusDialogOpen] = useState(false)
  const { translations } = useLanguage()
  const sprint: Sprint | null = useSelector((state: RootState) => state.sprints.singleSprint)


  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case SprintStatus.ACTIVE:
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">{translations.sprint.statusOptions.active}</Badge>
      case SprintStatus.PLANNED:
        return (
          <Badge variant="outline" className="border-[var(--fixed-card-border)]">
            {translations.sprint.statusOptions.planned}
          </Badge>
        )
      case SprintStatus.COMPLETED:
        return (
          <Badge variant="secondary" className="bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]">
            {translations.sprint.statusOptions.completed}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Back button always on top left */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild className="border-[var(--fixed-card-border)]">
          <Link href="/project-sprints">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sprints
          </Link>
        </Button>
      </div>

      {/* Main content area: `nameDiv` and buttons. This div is responsive. */}
      {/* On mobile: flex-col (vertical stack). On md screens and up: flex-row (horizontal alignment) and justify-between to push to ends. */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="nameDiv">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{sprint.name}</h1>
            {getStatusBadge(sprint.sprintStatus)}
          </div>
          <div className="flex items-center text-[var(--fixed-sidebar-muted)] mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {format(new Date(sprint.startDate), "MMM d, yyyy")} - {format(new Date(sprint.endDate), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        {/* Buttons Section - wraps on mobile and moves to the right on web */}
        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => setChangeSprintStatusDialogOpen(true)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {sprint?.sprintStatus === SprintStatus.PLANNED ?
              translations.sprint.form.doActive :
              sprint?.sprintStatus === SprintStatus.ACTIVE ?
                translations.sprint.form.doPlan :
                translations.sprint.form.doPlan}
          </Button>
          {sprint?.sprintStatus === SprintStatus.ACTIVE && (
            <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => setIsCompleteDialogOpen(true)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {translations.sprint.form.completeSprint}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--fixed-card-border)]"
            onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            {translations.sprint.form.edit}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--fixed-danger)] text-[var(--fixed-danger)]"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {translations.sprint.form.delete}
          </Button>
        </div>
      </div>

      {/* Complete Sprint Dialog */}
      <CompleteSprintDialog
        fetchData={fetchData}
        sprint={sprint}
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
        tasks={tasks}
      />
      <ChangeSprintStatusDailog
        sprint={sprint}
        open={changeSprintStatusDialogOpen}
        onOpenChange={setChangeSprintStatusDialogOpen}
      />
    </div>
  )
}
