"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addInvitation } from "@/lib/redux/features/invitations-slice"
import { addNotification } from "@/lib/redux/features/notifications-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import type { Project } from "@/types/project"
import type { Task } from "@/types/task"

interface ProjectDialogsProps {
  project: Project
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
  createTaskDialogOpen: boolean
  setCreateTaskDialogOpen: (open: boolean) => void
  deleteTaskDialogOpen: boolean
  setDeleteTaskDialogOpen: (open: boolean) => void
  inviteDialogOpen: boolean
  setInviteDialogOpen: (open: boolean) => void
  selectedTask: Task | null
  onDeleteProject: () => void
  onDeleteTask: () => void
}

export function ProjectDialogs({
  project,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  createTaskDialogOpen,
  setCreateTaskDialogOpen,
  deleteTaskDialogOpen,
  setDeleteTaskDialogOpen,
  inviteDialogOpen,
  setInviteDialogOpen,
  selectedTask,
  onDeleteProject,
  onDeleteTask,
}: ProjectDialogsProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  const [inviteEmail, setInviteEmail] = useState("")
  const [selectedUserToInvite, setSelectedUserToInvite] = useState("")

  // Get users not in the project team
  const usersNotInTeam = users.filter(
    (user) => !project.team.some((member) => member.name === user.name) && user.id !== currentUser?.id,
  )

  // Handle user invitation
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault()

    // If a user is selected from the dropdown
    if (selectedUserToInvite) {
      const userToInvite = users.find((user) => user.id === selectedUserToInvite)

      if (userToInvite) {
        // Check if user is already in the team
        const isAlreadyInTeam = project.team.some((member) => member.name === userToInvite.name)

        if (isAlreadyInTeam) {
          alert("This user is already a member of the project team.")
          return
        }

        // Create invitation
        dispatch(
          addInvitation({
            id: `invitation-${Date.now()}`,
            type: "project",
            projectId: project.id,
            projectName: project.name,
            recipientId: userToInvite.id,
            recipientName: userToInvite.name,
            recipientEmail: userToInvite.email,
            senderId: currentUser?.id || "",
            senderName: currentUser?.name || "",
            senderAvatar: currentUser?.avatar || "",
            senderInitials: currentUser?.initials || "",
            status: "pending",
            createdAt: new Date().toISOString(),
          }),
        )

        // Add notification for the invited user
        dispatch(
          addNotification({
            id: `notification-${Date.now()}`,
            type: "invitation",
            title: "Project Invitation",
            message: `You have been invited to join the project "${project.name}"`,
            issueId: "",
            issueTitle: "",
            sender: {
              id: currentUser?.id || "",
              name: currentUser?.name || "",
              avatar: currentUser?.avatar || "",
              initials: currentUser?.initials || "",
            },
            date: new Date().toISOString(),
            read: false,
          }),
        )
      }
    }
    // If an email is entered
    else if (inviteEmail) {
      // Create invitation with email
      dispatch(
        addInvitation({
          id: `invitation-${Date.now()}`,
          type: "project",
          projectId: project.id,
          projectName: project.name,
          recipientId: "",
          recipientName: "",
          recipientEmail: inviteEmail,
          senderId: currentUser?.id || "",
          senderName: currentUser?.name || "",
          senderAvatar: currentUser?.avatar || "",
          senderInitials: currentUser?.initials || "",
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      )
    }

    setInviteDialogOpen(false)
    setInviteEmail("")
    setSelectedUserToInvite("")
  }

  return (
    <>
      <EditProjectDialog open={editDialogOpen} setOpen={setEditDialogOpen} project={project} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateTaskDialog open={createTaskDialogOpen} setOpen={setCreateTaskDialogOpen} projectId={project.id} />

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite User to Project</DialogTitle>
            <DialogDescription>Invite a user to join the project team.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInviteUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Select User
                </Label>
                <Select value={selectedUserToInvite} onValueChange={setSelectedUserToInvite}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersNotInTeam.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Or enter email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Invite User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task and remove all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
