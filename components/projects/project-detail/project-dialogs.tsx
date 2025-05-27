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
  editDialogOpen?: boolean
  setEditDialogOpen?: (open: boolean) => void
  deleteDialogOpen?: boolean
  setDeleteDialogOpen?: (open: boolean) => void
  createTaskDialogOpen?: boolean
  setCreateTaskDialogOpen?: (open: boolean) => void
  deleteTaskDialogOpen?: boolean
  setDeleteTaskDialogOpen?: (open: boolean) => void
  inviteDialogOpen?: boolean
  setInviteDialogOpen?: (open: boolean) => void
  selectedTask?: Task | null
  onDeleteProject?: () => void
  onDeleteTask?: () => void
}

export function ProjectDialogs({
  project,
  editDialogOpen = false,
  setEditDialogOpen = () => { },
  deleteDialogOpen = false,
  setDeleteDialogOpen = () => { },
  createTaskDialogOpen = false,
  setCreateTaskDialogOpen = () => { },
  deleteTaskDialogOpen = false,
  setDeleteTaskDialogOpen = () => { },
  inviteDialogOpen = false,
  setInviteDialogOpen = () => { },
  selectedTask = null,
  onDeleteProject = () => { },
  onDeleteTask = () => { },
}: ProjectDialogsProps) {
  return (
    <>
      {project && <EditProjectDialog projectId={project.id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />}

      <DeleteProjectDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onDelete={onDeleteProject} />

      <DeleteTaskDialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen} onDelete={onDeleteTask} />

      <InviteUserDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
    </>
  )
}
