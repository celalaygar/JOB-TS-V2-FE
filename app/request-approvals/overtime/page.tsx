import type { Metadata } from "next"
import { OvertimeApprovalsPage } from "./OvertimeApprovalsPage"

export const metadata: Metadata = {
  title: "Overtime Approvals",
  description: "Review and approve overtime requests from your team members",
}

export default function OvertimeApprovalsRoute() {
  return <OvertimeApprovalsPage />
}
