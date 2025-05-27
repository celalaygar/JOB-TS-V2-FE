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
import type { SpendingRequest } from "@/data/spending-requests"
import { useLanguage } from "@/lib/i18n/context"

interface DeleteSpendingRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: SpendingRequest
  onConfirm: (requestId: string) => void
}

export function DeleteSpendingRequestDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
}: DeleteSpendingRequestDialogProps) {
  const { translations } = useLanguage()

  const handleConfirm = () => {
    onConfirm(request.id)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translations.requests.spending.deleteConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{translations.requests.spending.deleteConfirmMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{translations.requests.spending.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-500 hover:bg-red-600">
            {translations.requests.spending.actions.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
