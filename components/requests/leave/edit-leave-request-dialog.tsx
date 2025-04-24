"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LeaveRequestForm, type LeaveFormValues } from "./leave-request-form"
import type { LeaveRequest, LeaveType } from "@/data/leave-requests"
import { useLanguage } from "@/lib/i18n/context"

interface EditLeaveRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: LeaveRequest
  onSubmit: (request: LeaveRequest) => void
}

export function EditLeaveRequestDialog({ open, onOpenChange, request, onSubmit }: EditLeaveRequestDialogProps) {
  const { translations } = useLanguage()

  const handleSubmit = (data: LeaveFormValues) => {
    // Update request
    const updatedRequest: LeaveRequest = {
      ...request,
      title: data.title,
      description: data.description,
      leaveType: data.leaveType as LeaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
    }

    onSubmit(updatedRequest)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{translations.requests.leave.editRequest}</DialogTitle>
          <DialogDescription>{translations.requests.leave.editRequestDescription}</DialogDescription>
        </DialogHeader>
        <LeaveRequestForm
          defaultValues={{
            title: request.title,
            description: request.description,
            leaveType: request.leaveType,
            startDate: request.startDate,
            endDate: request.endDate,
            reason: request.reason,
          }}
          onSubmit={handleSubmit}
          submitLabel={translations.requests.leave.actions.save}
        />
      </DialogContent>
    </Dialog>
  )
}
