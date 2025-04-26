export type OvertimeRequestStatus = "pending" | "approved" | "rejected"
export type OvertimeReason = "projectDeadline" | "maintenance" | "emergency" | "specialProject"

export interface OvertimeRequest {
  id: string
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  reason: string
  status: OvertimeRequestStatus
  createdAt: string
}
