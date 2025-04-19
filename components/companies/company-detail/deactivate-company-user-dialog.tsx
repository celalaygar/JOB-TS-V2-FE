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

interface DeactivateCompanyUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeactivateCompanyUserDialog({ userId, open, onOpenChange }: DeactivateCompanyUserDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const { toast } = useToast()

  // Get user from Redux store
  // For this example, we'll use a mock user if not found in the store
  const user = useSelector(
    (state: RootState) =>
      state.users?.users?.find((u) => u.id === userId) || { id: userId, name: "User", email: "user@example.com" },
  )

  const handleDeactivate = () => {
    // Dispatch action to deactivate user
    // dispatch(updateUserStatus({ userId, status: "inactive" }))

    toast({
      title: translations.companies?.userDeactivated || "User deactivated successfully",
      description: new Date().toLocaleString(),
    })

    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translations.companies?.deactivateUser || "Deactivate User"}</AlertDialogTitle>
          <AlertDialogDescription>
            {translations.companies?.deactivateUserConfirm || "Are you sure you want to deactivate this user?"}
            <div className="mt-2 font-medium">{user.name}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{translations.common?.cancel || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeactivate} className="bg-orange-600 hover:bg-orange-700">
            {translations.common?.deactivate || "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
