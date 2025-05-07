export type CompanySize = "small" | "medium" | "large" | "enterprise"
export type CompanyStatus = "active" | "inactive" | "pending"
export type CompanyIndustry =
  | "technology"
  | "healthcare"
  | "finance"
  | "education"
  | "retail"
  | "manufacturing"
  | "consulting"
  | "other"

export interface Company {
  id: string
  name: string
  code: string
  logo?: string
  address: string
  phone: string
  email: string
  website?: string
  status: CompanyStatus
  industry: CompanyIndustry
  size: CompanySize
  foundedDate?: string
  description?: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  createdAt: string
  updatedAt: string
}
