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

// Sample data
export const spendingRequests: SpendingRequest[] = [
  {
    id: "sr-001",
    title: "Business lunch with client",
    category: "food",
    amount: 450.75,
    receiptDate: new Date(2023, 3, 15),
    taxRate: "18",
    description: "Lunch meeting with potential client to discuss project requirements",
    status: "approved",
    createdAt: new Date(2023, 3, 15, 14, 30),
    userId: "user-1",
  },
  {
    id: "sr-002",
    title: "Office supplies",
    category: "business",
    amount: 235.5,
    receiptDate: new Date(2023, 3, 20),
    taxRate: "18",
    description: "Purchased notebooks, pens, and other office supplies",
    status: "approved",
    createdAt: new Date(2023, 3, 20, 10, 15),
    userId: "user-1",
  },
  {
    id: "sr-003",
    title: "Taxi to client meeting",
    category: "travel",
    amount: 120.0,
    receiptDate: new Date(2023, 4, 5),
    taxRate: "10",
    status: "pending",
    createdAt: new Date(2023, 4, 5, 16, 45),
    userId: "user-1",
  },
  {
    id: "sr-004",
    title: "Software subscription",
    category: "business",
    amount: 899.99,
    receiptDate: new Date(2023, 4, 10),
    taxRate: "18",
    description: "Annual subscription for design software",
    status: "pending",
    createdAt: new Date(2023, 4, 10, 9, 30),
    userId: "user-1",
  },
  {
    id: "sr-005",
    title: "Conference registration",
    category: "education",
    amount: 1500.0,
    receiptDate: new Date(2023, 4, 15),
    taxRate: "8",
    description: "Registration fee for industry conference",
    status: "rejected",
    createdAt: new Date(2023, 4, 15, 11, 20),
    userId: "user-1",
  },
]

export const categoryOptions = [
  { value: "travel", en: "Travel and Transportation", tr: "Yolculuk ve Ulaşım" },
  { value: "business", en: "Business Expenses", tr: "İş Giderleri" },
  { value: "invoices", en: "Invoices and Expenses", tr: "Fatura ve Giderler" },
  { value: "education", en: "Education and Courses", tr: "Eğitim ve Kurslar" },
  { value: "food", en: "Food and Drink", tr: "Yiyecek ve İçecek" },
  { value: "other", en: "Other", tr: "Diğer" },
]

export const taxRateOptions = [
  { value: "1", label: "1%" },
  { value: "8", label: "8%" },
  { value: "10", label: "10%" },
  { value: "18", label: "18%" },
  { value: "20", label: "20%" },
]
