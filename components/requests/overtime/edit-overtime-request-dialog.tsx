"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OvertimeRequestForm } from "@/components/requests/overtime/overtime-request-form"
import { useLanguage } from "@/lib/i18n/context"
import type { OvertimeRequest } from "@/data/overtime-requests"

interface EditOvertimeRequestDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  request: OvertimeRequest
  onSubmit: (data: OvertimeRequest) => void
}

export function EditOvertimeRequestDialog({ isOpen, onOpenChange, request, onSubmit }: EditOvertimeRequestDialogProps) {
  const { translations } = useLanguage()
  const t = translations.requests.overtime

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{t.editRequest}</DialogTitle>
        </DialogHeader>
        <OvertimeRequestForm initialData={request} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} isEdit />
      </DialogContent>
    </Dialog>
  )
}
