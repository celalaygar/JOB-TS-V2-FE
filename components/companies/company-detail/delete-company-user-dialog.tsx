"use client"

import { useDispatch, useSelector } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
import type { RootState } from "@/lib/redux/store"
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
import { useToast } from "@/hooks/use-toast"

interface DeleteCompanyUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCompanyUserDialog({ userId, open, onOpenChange }: DeleteCompanyUserDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const { toast } = useToast()

  // Get user from Redux store
  // For this example, we'll use a mock user if not found in the store
  const user = useSelector(
    (state: RootState) =>
      state.users?.users?.find((u) => u.id === userId) || { id: userId, name: "User", email: "user@example.com" },
  )

  const handleDelete = () => {
    // Dispatch action to delete user
    // dispatch(deleteUser(userId))

    toast({
      title: translations.companies?.userDeleted || "User deleted successfully",
      description: new Date().toLocaleString(),
    })

    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translations.companies?.deleteUser || "Delete User"}</AlertDialogTitle>
          <AlertDialogDescription>
            {translations.companies?.deleteUserConfirm ||
              "Are you sure you want to delete this user? This action cannot be undone."}
            <div className="mt-2 font-medium">{user.name}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{translations.common?.cancel || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            {translations.common?.delete || "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
