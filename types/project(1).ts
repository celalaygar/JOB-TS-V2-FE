export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed" | "Canceled"
export type ProjectPriority = "Low" | "Medium" | "High"

export interface ProjectTeamMember {
  id: string
  name?: string
  avatar?: string
  initials?: string
  role?: string
  status?: string
  email?: string
}

export interface ProjectSprint {
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
  issueCount: number
  openIssues?: number
  team?: ProjectTeamMember[]
  leadId?: string
  startDate?: string
  endDate?: string
  priority?: string
  tags?: string[]
  repository?: string
  sprintCount?: number
  milestoneCount?: number
  recentSprints?: ProjectSprint[]
}
