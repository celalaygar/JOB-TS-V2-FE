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
import { Project, ProjectUser } from "@/types/project"
import { Loader2 } from "lucide-react"

interface RemoveUserDialogProps {
  loading?: boolean
  project: Project
  projectUser: ProjectUser  // Added to pass the user being invited
  open: boolean
  onOpenChange: (open: boolean) => void
  removeUserFromProject: (user: ProjectUser) => void // Function to remove user from project
}
export function RemoveUserDialog({ loading, project, open, onOpenChange, projectUser, removeUserFromProject }: RemoveUserDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User from Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {projectUser?.firstname + " " + projectUser?.lastname} from this project?
          </DialogDescription>
        </DialogHeader>
        {
          loading ?
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </div>
            :
            <>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. The user will lose access to all project resources.
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium">User Details:</p>
                  <p className="text-sm text-muted-foreground">
                    {projectUser?.firstname + " " + projectUser?.lastname} ({projectUser?.email})
                  </p>
                </div>
              </div>
            </>
        }
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={() => {
              if (projectUser) {
                removeUserFromProject(projectUser);
              }
              onOpenChange(false);
            }}
          >
            Remove User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
