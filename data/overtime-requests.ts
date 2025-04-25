import type { OvertimeRequest } from "../types/overtime-request"

// Sample data for demonstration
export const sampleOvertimeRequests: OvertimeRequest[] = [
  {
    id: "1",
    title: "Sprint Release Support",
    description: "Need to stay late to support the release of Sprint 23",
    startDateTime: "2023-11-15T18:00:00",
    endDateTime: "2023-11-15T22:00:00",
    reason: "projectDeadline",
    status: "approved",
    createdAt: "2023-11-10T09:00:00",
  },
  {
    id: "2",
    title: "Database Migration",
    description: "Weekend work to migrate the database to the new server",
    startDateTime: "2023-11-18T10:00:00",
    endDateTime: "2023-11-18T18:00:00",
    reason: "maintenance",
    status: "pending",
    createdAt: "2023-11-12T14:30:00",
  },
  {
    id: "3",
    title: "Production Issue Fix",
    description: "Emergency fix for critical production issue",
    startDateTime: "2023-11-05T20:00:00",
    endDateTime: "2023-11-06T01:00:00",
    reason: "emergency",
    status: "approved",
    createdAt: "2023-11-05T19:00:00",
  },
  {
    id: "4",
    title: "Client Demo Preparation",
    description: "Prepare for important client demo scheduled for tomorrow",
    startDateTime: "2023-11-20T17:00:00",
    endDateTime: "2023-11-20T21:00:00",
    reason: "specialProject",
    status: "rejected",
    createdAt: "2023-11-18T10:15:00",
  },
]
