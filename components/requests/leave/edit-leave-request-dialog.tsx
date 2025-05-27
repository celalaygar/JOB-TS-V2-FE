"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LeaveRequestForm, type LeaveFormValues } from "./leave-request-form"
import { useLanguage } from "@/lib/i18n/context"
import type { LeaveRequest } from "@/types/leave-request"

interface EditLeaveRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: LeaveRequest
  onSubmit: (data: LeaveFormValues) => void
}

export function EditLeaveRequestDialog({ open, onOpenChange, request, onSubmit }: EditLeaveRequestDialogProps) {
  const { translations } = useLanguage()

  // Prepare form default values
  const defaultValues = {
    title: request.title,
    description: request.description,
    leaveType: request.leaveType,
    startDate: request.startDate,
    endDate: request.endDate,
    startTime: request.startTime || "09:00",
    endTime: request.endTime || "18:00",
    reason: request.reason,
  }

  // Handle form submission
  const handleSubmit = (data: LeaveFormValues) => {
    // Preserve the original request ID and other fields
    onSubmit({
      ...data,
      id: request.id,
      status: request.status,
      createdAt: request.createdAt,
      userId: request.userId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{translations.requests.leave.editRequest}</DialogTitle>
        </DialogHeader>
        <LeaveRequestForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel={translations.requests.leave.updateButton}
        />
      </DialogContent>
    </Dialog>
  )
}
