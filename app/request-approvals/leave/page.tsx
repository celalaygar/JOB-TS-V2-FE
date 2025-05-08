import type { Metadata } from "next"
import { LeaveApprovalsPage } from "./LeaveApprovalsPage"

export const metadata: Metadata = {
  title: "Leave Approvals",
  description: "Review and approve leave requests from your team members",
}

export default function LeaveApprovalsRoute() {
  return <LeaveApprovalsPage />
}
