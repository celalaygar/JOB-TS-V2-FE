export type UserRole = "Admin" | "Developer" | "Tester" | "Product Owner" | "Manager"
export type UserDepartment = "Engineering" | "Quality Assurance" | "Product" | "IT" | "Marketing" | "Sales" | "HR"

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  initials: string
  department?: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  position?: string
  company?: string
}
