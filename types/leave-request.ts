export type LeaveType =
  | "military"
  | "paternity"
  | "maternity"
  | "postpartum"
  | "marriage"
  | "sick"
  | "jobSearch"
  | "compassionate"
  | "nursing"
  | "unpaid"
  | "remote"
  | "bereavement"
  | "annual"
  | "travel"

export type LeaveRequestStatus = "pending" | "approved" | "rejected"

export interface LeaveRequest {
  id: string
  title: string
  description: string
  leaveType: LeaveType
  startDate: Date
  endDate: Date
  startTime?: string // HH:MM format
  endTime?: string // HH:MM format
  reason: string
  status: LeaveRequestStatus
  createdAt: Date
  userId: string
  year?: number // Year of the request for grouping
  workHours?: number // Calculated work hours
  workDays?: number // Calculated work days (8-9 hours = 1 day)
}
