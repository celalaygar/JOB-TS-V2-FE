"use client"

import { v4 as uuidv4 } from "uuid"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LeaveRequestForm, type LeaveFormValues } from "./leave-request-form"
import type { LeaveRequest, LeaveType } from "@/data/leave-requests"
import { useLanguage } from "@/lib/i18n/context"

interface CreateLeaveRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (request: LeaveRequest) => void
}

export function CreateLeaveRequestDialog({ open, onOpenChange, onSubmit }: CreateLeaveRequestDialogProps) {
  const { translations } = useLanguage()

  const handleSubmit = (data: LeaveFormValues) => {
    // Create a new request
    const newRequest: LeaveRequest = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      leaveType: data.leaveType as LeaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: "pending",
      createdAt: new Date(),
      userId: "user-1", // Assuming current user
    }

    onSubmit(newRequest)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{translations.requests.leave.newRequest}</DialogTitle>
          <DialogDescription>{translations.requests.leave.newRequestDescription}</DialogDescription>
        </DialogHeader>
        <LeaveRequestForm onSubmit={handleSubmit} submitLabel={translations.requests.leave.submitButton} />
      </DialogContent>
    </Dialog>
  )
}
