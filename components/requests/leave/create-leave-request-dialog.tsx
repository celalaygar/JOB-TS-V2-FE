"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LeaveRequestForm, type LeaveFormValues } from "./leave-request-form"
import { useLanguage } from "@/lib/i18n/context"

interface CreateLeaveRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LeaveFormValues) => void
}

export function CreateLeaveRequestDialog({ open, onOpenChange, onSubmit }: CreateLeaveRequestDialogProps) {
  const { translations } = useLanguage()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{translations.requests.leave.createRequest}</DialogTitle>
        </DialogHeader>
        <LeaveRequestForm
          onSubmit={onSubmit}
          submitLabel={translations.requests.leave.createButton}
          defaultValues={{
            startTime: "09:00",
            endTime: "18:00",
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
