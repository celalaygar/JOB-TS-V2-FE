export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed" | "Canceled"
export type ProjectPriority = "Low" | "Medium" | "High"

export interface ProjectStatusOption {
  id: number
  value: "Planning" | "In Progress" | "On Hold" | "Completed" | "Canceled"
  label: string
}
export interface ProjectPriorityOption {
  id: number
  value: "Low" | "Medium" | "High"
  label: string
}



export interface ProjectTeamMember {
  userId: string
  name: string
  avatar?: string
  initials: string
  role?: string
  systemRole?: string
  teamRole?: string
  companyRole?: string
  status?: string
  id: number
  email: string
  department?: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  position?: string
  company?: string
}
export interface ProjectUser {
  userId: string
  name: string
  avatar?: string
  initials: string
  role?: string
  systemRole?: string
  teamRole?: string
  companyRole?: string
  status?: string
  id: number
  email: string
  department?: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  position?: string
  company?: string
}
export interface ProjectSprint {
  id: string
  name: string
  status: string
  startDate: string
  endDate: string
  progress: number
}
export interface ProjectBacklog {
  id: string
  name: string
  status: string
  startDate: string
  endDate: string
  progress: number
}

export interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  issueCount?: number
  openIssues?: number
  users?: ProjectUser[]
  team?: ProjectTeamMember[]
  createdBy?: ProjectUser
  leadId?: string
  startDate?: string
  endDate?: string
  priority?: string
  tags?: string[]
  repository?: string
  sprintCount?: number
  milestoneCount?: number
  recentSprints?: ProjectSprint[]
  sprints?: ProjectSprint[]
  backlog?: ProjectBacklog
}

export const projectStatusOptions: ProjectStatusOption[] = [
  { id: 1, value: "Planning", label: "Planning" },
  { id: 2, value: "In Progress", label: "In Progress" },
  { id: 3, value: "On Hold", label: "On Hold" },
  { id: 4, value: "Completed", label: "Completed" },
  { id: 5, value: "Canceled", label: "Canceled" },
]
export const projectPriorityOptions: ProjectPriorityOption[] = [
  { id: 2, value: "Low", label: "Low" },
  { id: 3, value: "Medium", label: "Medium" },
  { id: 1, value: "High", label: "High" },
]