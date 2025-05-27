"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { removeSprint } from "@/lib/redux/features/sprints-slice"
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

interface DeleteSprintDialogProps {
  sprintId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSprintDialog({ sprintId, open, onOpenChange }: DeleteSprintDialogProps) {
  const dispatch = useDispatch()
  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!sprint) return

    setIsDeleting(true)

    try {
      dispatch(removeSprint(sprintId))
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting sprint:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!sprint) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Sprint</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{sprint.name}</strong>? This action cannot be undone and will remove
            all tasks associated with this sprint.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[var(--fixed-danger)] text-white"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Sprint"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
