"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OvertimeRequestForm } from "@/components/requests/overtime/overtime-request-form"
import { useLanguage } from "@/lib/i18n/context"
import type { OvertimeRequest } from "@/data/overtime-requests"

interface CreateOvertimeRequestDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: OvertimeRequest) => void
}

export function CreateOvertimeRequestDialog({ isOpen, onOpenChange, onSubmit }: CreateOvertimeRequestDialogProps) {
  const { translations } = useLanguage()
  const t = translations.requests.overtime

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{t.newRequest}</DialogTitle>
        </DialogHeader>
        <OvertimeRequestForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
