export type ApprovalStatus = "pending" | "approved" | "rejected"

export interface Requester {
  id: string
  name: string
  email: string
  avatar?: string
  department: string
  position: string
}

export interface BaseApprovalRequest {
  id: string
  title: string
  requester: Requester
  status: ApprovalStatus
  createdAt: string
  notes?: string
}

export interface SpendingApprovalRequest extends BaseApprovalRequest {
  amount: number
  category: string
  receiptDate: string
  taxRate: string
  description?: string
  attachmentUrl?: string
}

export interface LeaveApprovalRequest extends BaseApprovalRequest {
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  totalDays: number
}

export interface OvertimeApprovalRequest extends BaseApprovalRequest {
  startDateTime: string
  endDateTime: string
  reason: string
  duration: number
  location: string
}
