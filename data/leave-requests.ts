import { v4 as uuidv4 } from "uuid"
import type { LeaveRequest } from "@/types/leave-request"

// Helper function to create dates with specific times
const createDateWithTime = (year: number, month: number, day: number, hours: number, minutes: number): Date => {
  return new Date(year, month, day, hours, minutes)
}

// Calculate work hours between two dates with times
const calculateWorkHours = (startDate: Date, endDate: Date, startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  const start = new Date(startDate)
  start.setHours(startHour, startMinute, 0)

  const end = new Date(endDate)
  end.setHours(endHour, endMinute, 0)

  // Calculate difference in milliseconds
  const diffMs = end.getTime() - start.getTime()

  // Convert to hours (excluding weekends)
  let totalHours = diffMs / (1000 * 60 * 60)

  // Adjust for weekends if spanning multiple days
  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (daysDiff > 0) {
    let weekendDays = 0
    const tempDate = new Date(start)
    for (let i = 0; i <= daysDiff; i++) {
      const day = tempDate.getDay()
      if (day === 0 || day === 6) weekendDays++
      tempDate.setDate(tempDate.getDate() + 1)
    }
    totalHours -= weekendDays * 24
  }

  return Math.max(0, totalHours)
}

// Calculate work days based on work hours (8-9 hours = 1 day)
const calculateWorkDays = (hours: number): number => {
  return Math.round((hours / 8) * 10) / 10 // Round to 1 decimal place
}

export const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: uuidv4(),
    title: "Spring Break",
    description: "Taking time off for spring vacation",
    leaveType: "annual",
    startDate: createDateWithTime(2025, 3, 10, 9, 0),
    endDate: createDateWithTime(2025, 3, 15, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "Family vacation",
    status: "approved",
    createdAt: new Date(2025, 2, 20),
    userId: "user1",
    year: 2025,
    workHours: 40,
    workDays: 5,
  },
  {
    id: uuidv4(),
    title: "Medical Appointment",
    description: "Doctor's appointment",
    leaveType: "sick",
    startDate: createDateWithTime(2025, 2, 5, 13, 0),
    endDate: createDateWithTime(2025, 2, 5, 18, 0),
    startTime: "13:00",
    endTime: "18:00",
    reason: "Regular checkup",
    status: "approved",
    createdAt: new Date(2025, 2, 1),
    userId: "user1",
    year: 2025,
    workHours: 5,
    workDays: 0.6,
  },
  {
    id: uuidv4(),
    title: "Summer Holiday",
    description: "Annual summer vacation",
    leaveType: "annual",
    startDate: createDateWithTime(2025, 6, 1, 9, 0),
    endDate: createDateWithTime(2025, 6, 10, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "Summer break",
    status: "pending",
    createdAt: new Date(2025, 5, 15),
    userId: "user1",
    year: 2025,
    workHours: 64,
    workDays: 8,
  },
  {
    id: uuidv4(),
    title: "Annual Leave",
    description: "Taking time off for vacation",
    leaveType: "annual",
    startDate: createDateWithTime(2023, 6, 15, 9, 0),
    endDate: createDateWithTime(2023, 6, 20, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "Family vacation",
    status: "approved",
    createdAt: new Date(2023, 6, 1),
    userId: "user1",
    year: 2023,
    workHours: 40,
    workDays: 5,
  },
  {
    id: uuidv4(),
    title: "Sick Leave",
    description: "Not feeling well",
    leaveType: "sick",
    startDate: createDateWithTime(2023, 7, 5, 9, 0),
    endDate: createDateWithTime(2023, 7, 5, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "Fever and cold",
    status: "approved",
    createdAt: new Date(2023, 7, 4),
    userId: "user1",
    year: 2023,
    workHours: 8,
    workDays: 1,
  },
  {
    id: uuidv4(),
    title: "Half Day Leave",
    description: "Doctor appointment",
    leaveType: "sick",
    startDate: createDateWithTime(2023, 8, 10, 13, 0),
    endDate: createDateWithTime(2023, 8, 10, 18, 0),
    startTime: "13:00",
    endTime: "18:00",
    reason: "Doctor appointment",
    status: "approved",
    createdAt: new Date(2023, 8, 8),
    userId: "user1",
    year: 2023,
    workHours: 5,
    workDays: 0.6,
  },
  {
    id: uuidv4(),
    title: "Paternity Leave",
    description: "Baby is coming",
    leaveType: "paternity",
    startDate: createDateWithTime(2023, 9, 1, 9, 0),
    endDate: createDateWithTime(2023, 9, 15, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "Birth of child",
    status: "approved",
    createdAt: new Date(2023, 8, 15),
    userId: "user1",
    year: 2023,
    workHours: 80,
    workDays: 10,
  },
  {
    id: uuidv4(),
    title: "Remote Work",
    description: "Working from home",
    leaveType: "remote",
    startDate: createDateWithTime(2023, 10, 5, 9, 0),
    endDate: createDateWithTime(2023, 10, 7, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "Home office",
    status: "pending",
    createdAt: new Date(2023, 10, 1),
    userId: "user1",
    year: 2023,
    workHours: 24,
    workDays: 3,
  },
  {
    id: uuidv4(),
    title: "Annual Leave",
    description: "Year-end vacation",
    leaveType: "annual",
    startDate: createDateWithTime(2023, 11, 20, 9, 0),
    endDate: createDateWithTime(2023, 11, 30, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "Year-end break",
    status: "pending",
    createdAt: new Date(2023, 11, 1),
    userId: "user1",
    year: 2023,
    workHours: 64,
    workDays: 8,
  },
  {
    id: uuidv4(),
    title: "New Year Leave",
    description: "New Year celebration",
    leaveType: "annual",
    startDate: createDateWithTime(2024, 0, 2, 9, 0),
    endDate: createDateWithTime(2024, 0, 5, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "New Year celebration",
    status: "pending",
    createdAt: new Date(2023, 11, 15),
    userId: "user1",
    year: 2024,
    workHours: 32,
    workDays: 4,
  },
  {
    id: uuidv4(),
    title: "Conference Leave",
    description: "Attending tech conference",
    leaveType: "annual",
    startDate: createDateWithTime(2024, 1, 15, 9, 0),
    endDate: createDateWithTime(2024, 1, 17, 18, 0),
    startTime: "09:00",
    endTime: "18:00",
    reason: "Professional development",
    status: "pending",
    createdAt: new Date(2024, 1, 1),
    userId: "user1",
    year: 2024,
    workHours: 24,
    workDays: 3,
  },
]

// Helper function to calculate work hours and days for a leave request
export const calculateLeaveWorkTime = (
  startDate: Date,
  endDate: Date,
  startTime = "09:00",
  endTime = "18:00",
): { workHours: number; workDays: number } => {
  const workHours = calculateWorkHours(startDate, endDate, startTime, endTime)
  const workDays = calculateWorkDays(workHours)

  return { workHours, workDays }
}
