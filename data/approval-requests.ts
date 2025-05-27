import type { SpendingApprovalRequest, LeaveApprovalRequest, OvertimeApprovalRequest } from "../types/approval-request"

// Types for all approval requests
// export type ApprovalStatus = "pending" | "approved" | "rejected"

// Common interface for all approval requests
// export interface BaseApprovalRequest {
//   id: string
//   title: string
//   requester: {
//     id: string
//     name: string
//     email: string
//     avatar?: string
//     department: string
//     position: string
//   }
//   status: ApprovalStatus
//   createdAt: string
//   notes?: string
// }

// Spending approval request
// export interface SpendingApprovalRequest extends BaseApprovalRequest {
//   amount: number
//   category: string
//   receiptDate: string
//   taxRate: string
//   description?: string
//   attachmentUrl?: string
// }

// Leave approval request
// export interface LeaveApprovalRequest extends BaseApprovalRequest {
//   leaveType: string
//   startDate: string
//   endDate: string
//   reason: string
//   totalDays: number
// }

// Overtime approval request
// export interface OvertimeApprovalRequest extends BaseApprovalRequest {
//   startDateTime: string
//   endDateTime: string
//   reason: string
//   duration: number // in hours
//   location: string
// }

// Sample data for spending approval requests
export const spendingApprovalRequests: SpendingApprovalRequest[] = [
  {
    id: "SR001",
    title: "Office Supplies Purchase",
    requester: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Engineering",
      position: "Software Developer",
    },
    amount: 125.5,
    category: "Business Expenses",
    receiptDate: "2023-04-10",
    taxRate: "18",
    description: "Purchased notebooks, pens, and other office supplies for the team meeting",
    status: "pending",
    createdAt: "2023-04-09T14:30:00",
  },
  {
    id: "SR002",
    title: "Client Meeting Lunch",
    requester: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Sales",
      position: "Account Manager",
    },
    amount: 78.25,
    category: "Food and Drink",
    receiptDate: "2023-04-12",
    taxRate: "10",
    description: "Lunch with potential client to discuss project requirements",
    status: "pending",
    createdAt: "2023-04-12T15:45:00",
  },
  {
    id: "SR003",
    title: "Software License",
    requester: {
      id: "user-3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "IT",
      position: "System Administrator",
    },
    amount: 299.99,
    category: "Business Expenses",
    receiptDate: "2023-04-08",
    taxRate: "18",
    description: "Annual subscription for design software",
    status: "pending",
    createdAt: "2023-04-08T09:15:00",
  },
  {
    id: "SR004",
    title: "Conference Registration",
    requester: {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah.williams@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Marketing",
      position: "Marketing Specialist",
    },
    amount: 450.0,
    category: "Education and Courses",
    receiptDate: "2023-04-15",
    taxRate: "8",
    description: "Registration fee for industry conference next month",
    status: "pending",
    createdAt: "2023-04-14T11:20:00",
  },
]

// Sample data for leave approval requests
export const leaveApprovalRequests: LeaveApprovalRequest[] = [
  {
    id: "LR001",
    title: "Annual Leave",
    requester: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Engineering",
      position: "Software Developer",
    },
    leaveType: "Annual Leave",
    startDate: "2023-05-10",
    endDate: "2023-05-15",
    reason: "Family vacation planned months in advance",
    totalDays: 6,
    status: "pending",
    createdAt: "2023-04-15T10:30:00",
  },
  {
    id: "LR002",
    title: "Sick Leave",
    requester: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Sales",
      position: "Account Manager",
    },
    leaveType: "Sick Leave",
    startDate: "2023-04-20",
    endDate: "2023-04-22",
    reason: "Doctor recommended rest for 3 days due to flu",
    totalDays: 3,
    status: "pending",
    createdAt: "2023-04-19T08:45:00",
  },
  {
    id: "LR003",
    title: "Family Emergency",
    requester: {
      id: "user-3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "IT",
      position: "System Administrator",
    },
    leaveType: "Personal Leave",
    startDate: "2023-04-25",
    endDate: "2023-04-26",
    reason: "Need to attend to a family emergency",
    totalDays: 2,
    status: "pending",
    createdAt: "2023-04-24T16:20:00",
  },
  {
    id: "LR004",
    title: "Medical Appointment",
    requester: {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah.williams@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Marketing",
      position: "Marketing Specialist",
    },
    leaveType: "Sick Leave",
    startDate: "2023-05-05",
    endDate: "2023-05-05",
    reason: "Scheduled medical appointment",
    totalDays: 1,
    status: "pending",
    createdAt: "2023-04-28T09:10:00",
  },
]

// Sample data for overtime approval requests
export const overtimeApprovalRequests: OvertimeApprovalRequest[] = [
  {
    id: "OT001",
    title: "Sprint Deadline Work",
    requester: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Engineering",
      position: "Software Developer",
    },
    startDateTime: "2023-04-15T18:00:00",
    endDateTime: "2023-04-15T22:00:00",
    reason: "Project Deadline",
    duration: 4,
    location: "Office",
    status: "pending",
    createdAt: "2023-04-14T16:30:00",
  },
  {
    id: "OT002",
    title: "System Maintenance",
    requester: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "IT",
      position: "System Administrator",
    },
    startDateTime: "2023-04-16T20:00:00",
    endDateTime: "2023-04-17T02:00:00",
    reason: "System Maintenance",
    duration: 6,
    location: "Remote",
    status: "pending",
    createdAt: "2023-04-15T14:45:00",
  },
  {
    id: "OT003",
    title: "Production Issue Fix",
    requester: {
      id: "user-3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Engineering",
      position: "Senior Developer",
    },
    startDateTime: "2023-04-14T19:00:00",
    endDateTime: "2023-04-14T23:30:00",
    reason: "Emergency",
    duration: 4.5,
    location: "Remote",
    status: "pending",
    createdAt: "2023-04-14T18:30:00",
  },
  {
    id: "OT004",
    title: "Client Demo Preparation",
    requester: {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah.williams@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Sales",
      position: "Sales Representative",
    },
    startDateTime: "2023-04-18T17:00:00",
    endDateTime: "2023-04-18T20:00:00",
    reason: "Special Project",
    duration: 3,
    location: "Office",
    status: "pending",
    createdAt: "2023-04-17T15:20:00",
  },
]
