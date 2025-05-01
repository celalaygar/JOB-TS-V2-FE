"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateTeamDialog } from "./create-team-dialog"
import type { Project } from "@/types/project"
import type { Task } from "@/types/task"

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
  createTeamDialogOpen?: boolean
  setCreateTeamDialogOpen?: (open: boolean) => void
  selectedTask?: Task | null
  onDeleteProject?: () => void
  onDeleteTask?: () => void
}

export function ProjectDialogs({
  project,
  editDialogOpen = false,
  setEditDialogOpen = () => {},
  deleteDialogOpen = false,
  setDeleteDialogOpen = () => {},
  createTaskDialogOpen = false,
  setCreateTaskDialogOpen = () => {},
  deleteTaskDialogOpen = false,
  setDeleteTaskDialogOpen = () => {},
  inviteDialogOpen = false,
  setInviteDialogOpen = () => {},
  createTeamDialogOpen = false,
  setCreateTeamDialogOpen = () => {},
  selectedTask = null,
  onDeleteProject = () => {},
  onDeleteTask = () => {},
}: ProjectDialogsProps) {
  // Edit Project Dialog
  const EditProjectDialog = () => (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Make changes to your project here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={project?.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" defaultValue={project?.description} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Delete Project Dialog
  const DeleteProjectDialog = () => (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteProject}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Delete Task Dialog
  const DeleteTaskDialog = () => (
    <Dialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteTaskDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteTask}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Invite User Dialog
  const InviteUserDialog = () => (
    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>Invite a user to join this project.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="product-manager">Product Manager</option>
              <option value="tester">Tester</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Send Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <EditProjectDialog />
      <DeleteProjectDialog />
      <DeleteTaskDialog />
      <InviteUserDialog />
      {project && (
        <CreateTeamDialog
          projectId={project.id}
          open={createTeamDialogOpen}
          onOpenChange={setCreateTeamDialogOpen}
          onCreateTeam={(team) => {
            console.log("Team created:", team)
            // Here you would typically dispatch an action to add the team
          }}
        />
      )}
    </>
  )
}
