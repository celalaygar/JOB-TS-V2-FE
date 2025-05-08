import type { Metadata } from "next"
import { SpendingApprovalsPage } from "./SpendingApprovalsPage"

export const metadata: Metadata = {
  title: "Spending Approvals",
  description: "Review and approve spending requests from your team members",
}

export default function SpendingApprovalsRoute() {
  return <SpendingApprovalsPage />
}
