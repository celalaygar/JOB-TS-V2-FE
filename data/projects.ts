export interface IProject {
  id: string
  name: string
  description: string
  status: string
  progress: number
  issueCount: number
  openIssues?: number
  team?: {
    name: string
    avatar?: string
    initials: string
    role?: string
    status?: string
  }[]
  leadId?: string
  startDate?: string
  endDate?: string
  priority?: string
  tags?: string[]
  repository?: string
  sprintCount?: number
  milestoneCount?: number
  recentSprints?: {
    id: string
    name: string
    status: string
    startDate: string
    endDate: string
    progress: number
  }[]
}

export const projects: IProject[] = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Redesign the company website with a modern look and improved UX",
    status: "In Progress",
    progress: 65,
    issueCount: 12,
    openIssues: 5,
    leadId: "user-1",
    team: [
      {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        initials: "AJ",
        role: "Team Lead",
        status: "Active",
      },
      {
        name: "Sarah Miller",
        avatar: "/placeholder.svg",
        initials: "SM",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "Emily Wilson",
        avatar: "/placeholder.svg",
        initials: "EW",
        role: "UI/UX Designer",
        status: "Active",
      },
      {
        name: "Emily x Wilson x",
        avatar: "/placeholder.svg",
        initials: "EW",
        role: "UI/UX Designer",
        status: "Active",
      },
    ],
    startDate: "2023-01-15",
    endDate: "2023-12-31",
    priority: "High",
    tags: ["Web", "UI/UX", "Frontend"],
    repository: "https://github.com/company/website-redesign",
    sprintCount: 8,
    milestoneCount: 3,
    recentSprints: [
      {
        id: "sprint-1",
        name: "Sprint 8",
        status: "In Progress",
        startDate: "2023-11-01",
        endDate: "2023-11-15",
        progress: 60,
      },
      {
        id: "sprint-2",
        name: "Sprint 7",
        status: "Completed",
        startDate: "2023-10-15",
        endDate: "2023-10-31",
        progress: 100,
      },
    ],
  },
  {
    id: "project-2",
    name: "Mobile App",
    description: "Develop a cross-platform mobile application for iOS and Android",
    status: "In Progress",
    progress: 40,
    issueCount: 8,
    openIssues: 6,
    leadId: "user-2",
    team: [
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Mobile Lead",
        status: "Active",
      },
      {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        initials: "AJ",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "Sarah Miller 1",
        avatar: "/placeholder.svg",
        initials: "SM",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "Sarah Miller 2",
        avatar: "/placeholder.svg",
        initials: "SM",
        role: "Senior Developer",
        status: "Active",
      },
    ],
    startDate: "2023-03-01",
    endDate: "2023-12-15",
    priority: "Medium",
    tags: ["Mobile", "React Native", "Cross-platform"],
    repository: "https://github.com/company/mobile-app",
    sprintCount: 6,
    milestoneCount: 2,
    recentSprints: [
      {
        id: "sprint-3",
        name: "Sprint 6",
        status: "In Progress",
        startDate: "2023-10-15",
        endDate: "2023-10-31",
        progress: 45,
      },
      {
        id: "sprint-4",
        name: "Sprint 5",
        status: "Completed",
        startDate: "2023-10-01",
        endDate: "2023-10-15",
        progress: 100,
      },
    ],
  },
  {
    id: "project-3",
    name: "API Development",
    description: "Build a RESTful API for the new customer portal",
    status: "In Progress",
    progress: 80,
    issueCount: 5,
    openIssues: 1,
    leadId: "user-4",
    team: [
      {
        name: "Michael Brown",
        avatar: "/placeholder.svg",
        initials: "MB",
        role: "Backend Lead",
        status: "Active",
      },
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: " Chen 1",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "David  2",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
    ],
    startDate: "2023-02-01",
    endDate: "2023-11-30",
    priority: "High",
    tags: ["API", "Backend", "Node.js"],
    repository: "https://github.com/company/api-development",
    sprintCount: 9,
    milestoneCount: 3,
    recentSprints: [
      {
        id: "sprint-5",
        name: "Sprint 9",
        status: "In Progress",
        startDate: "2023-11-01",
        endDate: "2023-11-15",
        progress: 75,
      },
      {
        id: "sprint-6",
        name: "Sprint 8",
        status: "Completed",
        startDate: "2023-10-15",
        endDate: "2023-10-31",
        progress: 100,
      },
    ],
  },
  {
    id: "project-4",
    name: "E-commerce Platform",
    description: "Build an online store with product catalog and checkout system",
    status: "In Progress",
    progress: 30,
    issueCount: 15,
    openIssues: 12,
    leadId: "user-3",
    team: [
      {
        name: "Sarah Miller",
        avatar: "/placeholder.svg",
        initials: "SM",
        role: "Team Lead",
        status: "Active",
      },
      {
        name: "Michael Brown",
        avatar: "/placeholder.svg",
        initials: "MB",
        role: "Backend Developer",
        status: "Active",
      },
      {
        name: "Emily Wilson",
        avatar: "/placeholder.svg",
        initials: "EW",
        role: "Frontend Developer",
        status: "Active",
      },
      {
        name: "Michael Brown",
        avatar: "/placeholder.svg",
        initials: "MB",
        role: "Backend Lead",
        status: "Active",
      },
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: " Chen 1",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "David  2",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
    ],
    startDate: "2023-04-01",
    endDate: "2024-02-28",
    priority: "High",
    tags: ["E-commerce", "Fullstack", "Payment"],
    repository: "https://github.com/company/ecommerce-platform",
    sprintCount: 5,
    milestoneCount: 2,
    recentSprints: [
      {
        id: "sprint-7",
        name: "Sprint 5",
        status: "In Progress",
        startDate: "2023-10-15",
        endDate: "2023-10-31",
        progress: 35,
      },
      {
        id: "sprint-8",
        name: "Sprint 4",
        status: "Completed",
        startDate: "2023-10-01",
        endDate: "2023-10-15",
        progress: 100,
      },
    ],
  },
  {
    id: "project-5",
    name: "Analytics Dashboard",
    description: "Create a real-time analytics dashboard for business metrics",
    status: "Planning",
    progress: 10,
    issueCount: 4,
    openIssues: 4,
    leadId: "user-2",
    team: [
      {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        initials: "AJ",
        role: "Data Scientist",
        status: "Active",
      },
      {
        name: "Emily Wilson",
        avatar: "/placeholder.svg",
        initials: "EW",
        role: "Frontend Developer",
        status: "Active",
      },
      {
        name: "Michael Brown",
        avatar: "/placeholder.svg",
        initials: "MB",
        role: "Backend Lead",
        status: "Active",
      },
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: " Chen 1",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "David  2",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "Michael Brown",
        avatar: "/placeholder.svg",
        initials: "MB",
        role: "Backend Lead",
        status: "Active",
      },
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: " Chen 1",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "David  2",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
    ],
    startDate: "2023-11-01",
    endDate: "2024-03-31",
    priority: "Medium",
    tags: ["Analytics", "Dashboard", "Data Visualization"],
    repository: "https://github.com/company/analytics-dashboard",
    sprintCount: 1,
    milestoneCount: 0,
    recentSprints: [
      {
        id: "sprint-9",
        name: "Sprint 1",
        status: "Planning",
        startDate: "2023-11-15",
        endDate: "2023-11-30",
        progress: 5,
      },
    ],
  },
  {
    id: "project-6",
    name: "Content Management System",
    description: "Develop a custom CMS for the marketing team",
    status: "Planning",
    progress: 5,
    issueCount: 2,
    openIssues: 2,
    leadId: "user-5",
    team: [
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Backend Developer",
        status: "Active",
      },
      {
        name: "Sarah Miller",
        avatar: "/placeholder.svg",
        initials: "SM",
        role: "Frontend Developer",
        status: "Active",
      },
      {
        name: "Michael Brown",
        avatar: "/placeholder.svg",
        initials: "MB",
        role: "Backend Lead",
        status: "Active",
      },
      {
        name: "David Chen",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: " Chen 1",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
      {
        name: "David  2",
        avatar: "/placeholder.svg",
        initials: "DC",
        role: "Senior Developer",
        status: "Active",
      },
    ],
    startDate: "2023-12-01",
    endDate: "2024-04-30",
    priority: "Low",
    tags: ["CMS", "Marketing", "Content"],
    sprintCount: 0,
    milestoneCount: 0,
  },
]

export const projectProgress = [
  {
    id: "project-1",
    name: "Website Redesign",
    progress: 65,
  },
  {
    id: "project-2",
    name: "Mobile App",
    progress: 40,
  },
  {
    id: "project-3",
    name: "API Development",
    progress: 80,
  },
  {
    id: "project-4",
    name: "E-commerce Platform",
    progress: 30,
  },
]
