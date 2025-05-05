import type { Sprint } from "../types/sprint"

export const sprints: Sprint[] = [
  {
    id: "sprint-1",
    name: "Sprint 23",
    startDate: "2023-03-01T00:00:00Z",
    endDate: "2023-03-15T23:59:59Z",
    status: "active",
    totalIssues: 12,
    completedIssues: 5,
    team: [
      {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      {
        name: "Sarah Miller",
        avatar: "/placeholder.svg",
        initials: "SM",
      },
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
      },
      {
        name: "Emily Wilson",
        avatar: "/placeholder.svg",
        initials: "EW",
      },
    ],
  },
  {
    id: "sprint-2",
    name: "Sprint 24",
    startDate: "2023-03-16T00:00:00Z",
    endDate: "2023-03-30T23:59:59Z",
    status: "planned",
    totalIssues: 10,
    completedIssues: 0,
    team: [
      {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      {
        name: "Sarah Miller",
        avatar: "/placeholder.svg",
        initials: "SM",
      },
      {
        name: "Michael Brown",
        avatar: "/placeholder.svg",
        initials: "MB",
      },
    ],
  },
  {
    id: "sprint-3",
    name: "Sprint 25",
    startDate: "2023-03-31T00:00:00Z",
    endDate: "2023-04-14T23:59:59Z",
    status: "planned",
    totalIssues: 8,
    completedIssues: 0,
    team: [
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
      },
      {
        name: "Emily Wilson",
        avatar: "/placeholder.svg",
        initials: "EW",
      },
      {
        name: "Lisa Wang",
        avatar: "/placeholder.svg",
        initials: "LW",
      },
    ],
  },
  {
    id: "sprint-4",
    name: "Sprint 22",
    startDate: "2023-02-15T00:00:00Z",
    endDate: "2023-02-28T23:59:59Z",
    status: "completed",
    totalIssues: 15,
    completedIssues: 13,
    team: [
      {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      {
        name: "Sarah Miller",
        avatar: "/placeholder.svg",
        initials: "SM",
      },
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
      },
      {
        name: "Michael Brown",
        avatar: "/placeholder.svg",
        initials: "MB",
      },
    ],
  },
  {
    id: "sprint-5",
    name: "Sprint 21",
    startDate: "2023-02-01T00:00:00Z",
    endDate: "2023-02-14T23:59:59Z",
    status: "completed",
    totalIssues: 12,
    completedIssues: 12,
    team: [
      {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      {
        name: "Emily Wilson",
        avatar: "/placeholder.svg",
        initials: "EW",
      },
      {
        name: "Lisa Wang",
        avatar: "/placeholder.svg",
        initials: "LW",
      },
    ],
  },
]
