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
  reason: string
  status: LeaveRequestStatus
  createdAt: Date
  userId: string
}
