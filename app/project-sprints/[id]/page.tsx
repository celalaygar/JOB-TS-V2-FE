"use client"

import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { SprintDetailHeader } from "@/components/sprints/project-sprints/sprint-detail/sprint-detail-header"
import { SprintDetailInfo } from "@/components/sprints/project-sprints/sprint-detail/sprint-detail-info"
import { SprintDetailProgress } from "@/components/sprints/project-sprints/sprint-detail/sprint-detail-progress"
import { SprintDetailTasks } from "@/components/sprints/project-sprints/sprint-detail/sprint-detail-tasks"
import { EditSprintDialog } from "@/components/sprints/project-sprints/edit-sprint-dialog"
import { DeleteSprintDialog } from "@/components/sprints/project-sprints/delete-sprint-dialog"
import { useState } from "react"
import { tasks as dummyTasks } from "@/data/tasks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SprintDetailPage() {
  const params = useParams()
  const router = useRouter()
  const sprintId = params.id as string

  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))
  const teams = useSelector((state: RootState) => state.teams?.teams || [])
  const sprintTasks = dummyTasks.filter((task) => task.sprint === sprintId || task.sprint === "current")

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Find team for this sprint
  const sprintTeam = sprint?.team?.length
    ? teams.find((team) => sprint.team.some((member) => team.members.some((m) => m.id === member.id)))
    : null

  const updatedSprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))

  if (!sprint) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Sprint not found. It may have been deleted or you don't have access to it.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <SprintDetailHeader
        sprint={sprint}
        tasks={sprintTasks}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <SprintDetailInfo sprint={sprint} team={sprintTeam} />
          <SprintDetailTasks sprintId={sprint?.id} tasks={sprintTasks} />
        </div>
        <div>
          <SprintDetailProgress sprint={sprint} tasks={sprintTasks} />
        </div>
      </div>

      {/* Dialogs */}
      <EditSprintDialog sprintId={sprintId} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <DeleteSprintDialog
        sprintId={sprintId}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          // If dialog was closed and sprint was deleted, navigate back to sprints list
          if (!open && !updatedSprint) {
            router.push("/project-sprints")
          }
        }}
      />
    </div>
  )
}
