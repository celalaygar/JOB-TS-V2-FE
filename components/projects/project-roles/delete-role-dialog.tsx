"use client"

import { useDispatch } from "react-redux"
import { removeRole } from "@/lib/redux/features/project-roles-slice"
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

interface DeleteRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleId: string | null
}

export function DeleteRoleDialog({ open, onOpenChange, roleId }: DeleteRoleDialogProps) {
  const dispatch = useDispatch()

  const handleDelete = () => {
    if (roleId) {
      dispatch(removeRole(roleId))
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this role?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Users with this role will lose their permissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-[var(--fixed-danger)] text-white hover:bg-[var(--fixed-danger)]/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
