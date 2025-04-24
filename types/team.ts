export type TeamMemberStatus = "Active" | "Banned" | "Inactive"

export interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: string
  status: TeamMemberStatus
  avatar: string
  initials: string
  department: string
  phone: string
  joinedAt: string
}

export interface Team {
  id: string
  projectId: string
  projectName: string
  name: string
  description: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}

export type TeamWithMembers = Team

export interface ProjectWithTeams {
  projectId: string
  projectName: string
  teams: TeamWithMembers[]
}
