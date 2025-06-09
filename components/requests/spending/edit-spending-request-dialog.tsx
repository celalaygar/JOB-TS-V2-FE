"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SpendingRequestForm, type SpendingFormValues } from "./spending-request-form"
import type { SpendingRequest, SpendingCategory, TaxRate } from "@/data/spending-requests"
import { useLanguage } from "@/lib/i18n/context"

interface EditSpendingRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: SpendingRequest
  onSubmit: (request: SpendingRequest) => void
}

export function EditSpendingRequestDialog({ open, onOpenChange, request, onSubmit }: EditSpendingRequestDialogProps) {
  const { translations } = useLanguage()

  const handleSubmit = (data: SpendingFormValues) => {
    // Update request
    const updatedRequest: SpendingRequest = {
      ...request,
      title: data.title,
      category: data.category as SpendingCategory,
      amount: Number.parseFloat(data.amount.replace(",", ".")),
      receiptDate: data.receiptDate,
      taxRate: data.taxRate as TaxRate,
      description: data.description,
      attachmentUrl: data.attachmentUrl,
    }

    onSubmit(updatedRequest)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{translations.requests.spending.editRequest}</DialogTitle>
        </DialogHeader>
        <SpendingRequestForm
          defaultValues={{
            title: request.title,
            category: request.category,
            amount: request.amount.toString(),
            receiptDate: request.receiptDate,
            taxRate: request.taxRate,
            description: request.description,
            attachmentUrl: request.attachmentUrl,
          }}
          onSubmit={handleSubmit}
          submitLabel={translations.requests.spending.actions.save}
        />
      </DialogContent>
    </Dialog>
  )
}
