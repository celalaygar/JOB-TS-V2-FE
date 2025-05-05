export type SprintStatus = "planned" | "active" | "completed"

export interface SprintTeamMember {
  name: string
  avatar?: string
  initials: string
}

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: SprintStatus
  totalIssues: number
  completedIssues: number
  team: SprintTeamMember[]
}
