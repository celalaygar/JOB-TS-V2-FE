export type LeaveType =
  | "military"
  | "paternity"
  | "maternity"
  | "postpartum"
  | "marriage"
  | "sick"
  | "jobSearch"
  | "compassionate"
  | "nursing"
  | "unpaid"
  | "remote"
  | "bereavement"
  | "annual"
  | "travel"

export interface LeaveRequest {
  id: string
  title: string
  description: string
  leaveType: LeaveType
  startDate: Date
  endDate: Date
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  userId: string
}

// Helper function to get leave type label based on language
export function getLeaveTypeLabel(leaveType: LeaveType, language: "en" | "tr"): string {
  const leaveTypeLabels: Record<LeaveType, { en: string; tr: string }> = {
    military: { en: "Military Leave", tr: "Askerlik İzni" },
    paternity: { en: "Paternity Leave", tr: "Babalık İzni" },
    maternity: { en: "Maternity Leave", tr: "Doğum İzni" },
    postpartum: { en: "Postpartum Leave", tr: "Doğum Sonrası İzni" },
    marriage: { en: "Marriage Leave", tr: "Evlilik İzni" },
    sick: { en: "Sick Leave", tr: "Hastalık İzni" },
    jobSearch: { en: "Job Search Leave", tr: "İş Arama İzni" },
    compassionate: { en: "Compassionate Leave", tr: "Mazeret İzni" },
    nursing: { en: "Nursing Leave", tr: "Süt İzni" },
    unpaid: { en: "Unpaid Leave", tr: "Ücretsiz İzin" },
    remote: { en: "Remote Work Leave", tr: "Uzaktan Çalışma İzni" },
    bereavement: { en: "Bereavement Leave", tr: "Vefat İzni" },
    annual: { en: "Annual Leave", tr: "Yıllık İzin" },
    travel: { en: "Travel Leave", tr: "Yol İzni" },
  }

  return leaveTypeLabels[leaveType][language]
}

// Sample leave requests data
export const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: "leave-1",
    title: "Annual vacation",
    description: "Taking my yearly vacation to visit family",
    leaveType: "annual",
    startDate: new Date(2023, 6, 15),
    endDate: new Date(2023, 6, 30),
    reason: "Family vacation planned months in advance",
    status: "approved",
    createdAt: new Date(2023, 5, 1),
    userId: "user-1",
  },
  {
    id: "leave-2",
    title: "Sick leave",
    description: "Recovering from flu",
    leaveType: "sick",
    startDate: new Date(2023, 8, 5),
    endDate: new Date(2023, 8, 7),
    reason: "Doctor recommended rest for 3 days",
    status: "approved",
    createdAt: new Date(2023, 8, 5),
    userId: "user-1",
  },
  {
    id: "leave-3",
    title: "Wedding leave",
    description: "Getting married",
    leaveType: "marriage",
    startDate: new Date(2023, 9, 10),
    endDate: new Date(2023, 9, 17),
    reason: "Wedding ceremony and honeymoon",
    status: "pending",
    createdAt: new Date(2023, 8, 15),
    userId: "user-1",
  },
  {
    id: "leave-4",
    title: "Remote work request",
    description: "Working from another city",
    leaveType: "remote",
    startDate: new Date(2023, 10, 1),
    endDate: new Date(2023, 10, 5),
    reason: "Need to attend a family event but can work remotely",
    status: "rejected",
    createdAt: new Date(2023, 9, 20),
    userId: "user-1",
  },
  {
    id: "leave-5",
    title: "Unpaid leave request",
    description: "Personal development time",
    leaveType: "unpaid",
    startDate: new Date(2023, 11, 1),
    endDate: new Date(2023, 11, 31),
    reason: "Taking a month to focus on personal development project",
    status: "pending",
    createdAt: new Date(2023, 10, 15),
    userId: "user-1",
  },
]
