"use client"

import { EditProjectDialog } from "@/components/projects/edit-project-dialog"
import { CreateTeamDialog } from "./create-team-dialog"
import type { Project } from "@/types/project"
import type { Task } from "@/types/task"
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog"
import { DeleteTaskDialog } from "./dialogs/delete-task-dialog"
import { InviteUserDialog } from "./dialogs/invite-user-dialog"

interface ProjectDialogsProps {
  project?: Project
  deleteDialogOpen?: boolean
  setDeleteDialogOpen?: (open: boolean) => void
  deleteTaskDialogOpen?: boolean
  setDeleteTaskDialogOpen?: (open: boolean) => void
  onDeleteProject?: () => void
  onDeleteTask?: () => void
}

export function ProjectDialogs({
  project,
  deleteDialogOpen = false,
  setDeleteDialogOpen = () => { },
  deleteTaskDialogOpen = false,
  setDeleteTaskDialogOpen = () => { },
  onDeleteProject = () => { },
  onDeleteTask = () => { },
}: ProjectDialogsProps) {
  return (
    <>

      <DeleteProjectDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onDelete={onDeleteProject} />

      <DeleteTaskDialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen} onDelete={onDeleteTask} />

    </>
  )
}
