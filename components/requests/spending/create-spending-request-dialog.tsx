"use client"

import { v4 as uuidv4 } from "uuid"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SpendingRequestForm, type SpendingFormValues } from "./spending-request-form"
import type { SpendingRequest, SpendingCategory, TaxRate } from "@/data/spending-requests"
import { useLanguage } from "@/lib/i18n/context"

interface CreateSpendingRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (request: SpendingRequest) => void
}

export function CreateSpendingRequestDialog({ open, onOpenChange, onSubmit }: CreateSpendingRequestDialogProps) {
  const { translations } = useLanguage()

  const handleSubmit = (data: SpendingFormValues) => {
    // Create a new request
    const newRequest: SpendingRequest = {
      id: uuidv4(),
      title: data.title,
      category: data.category as SpendingCategory,
      amount: Number.parseFloat(data.amount.replace(",", ".")),
      receiptDate: data.receiptDate,
      taxRate: data.taxRate as TaxRate,
      description: data.description,
      attachmentUrl: data.attachmentUrl,
      status: "pending",
      createdAt: new Date(),
      userId: "user-1", // Assuming current user
    }

    onSubmit(newRequest)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{translations.requests.spending.addReceipt}</DialogTitle>
        </DialogHeader>
        <SpendingRequestForm onSubmit={handleSubmit} submitLabel={translations.requests.spending.submitButton} />
      </DialogContent>
    </Dialog>
  )
}
