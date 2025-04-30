export type SpendingCategory = "travel" | "business" | "invoices" | "education" | "food" | "other"
export type TaxRate = "1" | "8" | "10" | "18" | "20"
export type RequestStatus = "pending" | "approved" | "rejected"

export interface SpendingRequest {
  id: string
  title: string
  category: SpendingCategory
  amount: number
  receiptDate: Date
  taxRate: TaxRate
  description?: string
  attachmentUrl?: string
  status: RequestStatus
  createdAt: Date
  userId: string
}

export interface CategoryOption {
  value: SpendingCategory
  en: string
  tr: string
}

export interface TaxRateOption {
  value: TaxRate
  label: string
}
