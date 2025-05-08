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
import type { LeaveRequest } from "@/data/leave-requests"
import { useLanguage } from "@/lib/i18n/context"

interface DeleteLeaveRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: LeaveRequest
  onConfirm: (requestId: string) => void
}

export function DeleteLeaveRequestDialog({ open, onOpenChange, request, onConfirm }: DeleteLeaveRequestDialogProps) {
  const { translations } = useLanguage()

  const handleConfirm = () => {
    onConfirm(request.id)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translations.requests.leave.deleteConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{translations.requests.leave.deleteConfirmMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{translations.requests.leave.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-500 hover:bg-red-600">
            {translations.requests.leave.actions.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
