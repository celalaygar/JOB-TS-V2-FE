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

interface ActivateCompanyUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivateCompanyUserDialog({ userId, open, onOpenChange }: ActivateCompanyUserDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const { toast } = useToast()

  // Get user from Redux store
  // For this example, we'll use a mock user if not found in the store
  const user = useSelector(
    (state: RootState) =>
      state.users?.users?.find((u) => u.id === userId) || { id: userId, name: "User", email: "user@example.com" },
  )

  const handleActivate = () => {
    // Dispatch action to activate user
    // dispatch(updateUserStatus({ userId, status: "active" }))

    toast({
      title: translations.companies?.userActivated || "User activated successfully",
      description: new Date().toLocaleString(),
    })

    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translations.companies?.activateUser || "Activate User"}</AlertDialogTitle>
          <AlertDialogDescription>
            {translations.companies?.activateUserConfirm || "Are you sure you want to activate this user?"}
            <div className="mt-2 font-medium">{user.name}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{translations.common?.cancel || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={handleActivate} className="bg-green-600 hover:bg-green-700">
            {translations.common?.activate || "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
