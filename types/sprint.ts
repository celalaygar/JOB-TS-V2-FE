export type SprintStatus = "planned" | "active" | "completed" | "planning" | "cancelled"
export type SprintType = "standard" | "project-team"

export interface SprintTeamMember {
  name: string
  avatar?: string
  initials: string
}

export interface Sprint {
  id: string
  name: string
  description?: string
  projectId: string
  startDate: string
  endDate: string
  status: SprintStatus
  completionStatus?: string
  sprintType?: SprintType
  teamId?: string
  totalIssues: number
  completedIssues: number
  team: SprintTeamMember[]
  tasks?: any[]
  createdAt?: string
  updatedAt?: string

} 