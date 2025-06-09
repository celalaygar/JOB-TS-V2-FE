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

interface DeleteOvertimeRequestDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

export function DeleteOvertimeRequestDialog({ isOpen, onOpenChange, onDelete }: DeleteOvertimeRequestDialogProps) {
  const { translations } = useLanguage()
  const t = translations.requests.overtime

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{t.deleteConfirmMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t.actions.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
