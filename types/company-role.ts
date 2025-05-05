export interface CompanyRole {
  id: string
  companyId: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  usersCount?: number
  isDefault?: boolean
  priority?: number
  color?: string
  sortOrder?: number
}

export type CompanyPermission =
  | "view_company"
  | "edit_company"
  | "delete_company"
  | "manage_users"
  | "manage_roles"
  | "view_reports"
  | "manage_teams"
  | "manage_projects"
  | "approve_requests"
  | "manage_finances"

export const COMPANY_PERMISSIONS: { value: CompanyPermission; label: string }[] = [
  { value: "view_company", label: "View Company" },
  { value: "edit_company", label: "Edit Company" },
  { value: "delete_company", label: "Delete Company" },
  { value: "manage_users", label: "Manage Users" },
  { value: "manage_roles", label: "Manage Roles" },
  { value: "view_reports", label: "View Reports" },
  { value: "manage_teams", label: "Manage Teams" },
  { value: "manage_projects", label: "Manage Projects" },
  { value: "approve_requests", label: "Approve Requests" },
  { value: "manage_finances", label: "Manage Finances" },
]
