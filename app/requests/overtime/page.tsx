import type { Metadata } from "next"
import { OvertimeRequestClientPage } from "./OvertimeRequestClientPage"

export const metadata: Metadata = {
  title: "Overtime Request",
  description: "Submit and manage overtime requests",
}

export default function OvertimePage() {
  return <OvertimeRequestClientPage />
}
