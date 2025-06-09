"use client"

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
import { ViewUserDialog } from "@/components/users/view-user-dialog"
import { EditUserDialog } from "@/components/users/edit-user-dialog"

interface UserDialogsProps {
  userToView: string | null
  setUserToView: (userId: string | null) => void
  userToEdit: string | null
  setUserToEdit: (userId: string | null) => void
  userToDelete: string | null
  setUserToDelete: (userId: string | null) => void
  onDeleteConfirm: () => void
}

export function UserDialogs({
  userToView,
  setUserToView,
  userToEdit,
  setUserToEdit,
  userToDelete,
  setUserToDelete,
  onDeleteConfirm,
}: UserDialogsProps) {
  return (
    <>
      {/* View User Dialog */}
      {userToView && (
        <ViewUserDialog userId={userToView} open={!!userToView} onOpenChange={(open) => !open && setUserToView(null)} />
      )}

      {/* Edit User Dialog */}
      {userToEdit && (
        <EditUserDialog userId={userToEdit} open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this user and remove them from all projects and
              issues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={onDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
