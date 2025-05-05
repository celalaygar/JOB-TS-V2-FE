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
import { useLanguage } from "@/lib/i18n/context"

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: () => void
}

export function ConfirmationDialog({ open, onClose, title, description, onConfirm }: ConfirmationDialogProps) {
  const { translations } = useLanguage()

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto">
            {translations.requests?.overtime.actions.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
          >
            {translations.requests?.overtime.actions.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
