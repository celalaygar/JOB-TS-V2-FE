import SpendingRequestClientPage from "./SpendingRequestClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Spending Request",
  description: "Submit and manage spending requests",
}

export default function SpendingRequestPage() {
  return <SpendingRequestClientPage />
}
