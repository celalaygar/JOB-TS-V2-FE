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

export interface CompanyTeam {
  id: string
  companyId: string
  companyName: string
  name: string
  description: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}

export type CompanyTeamWithMembers = CompanyTeam

export interface CompanyWithTeams {
  companyId: string
  companyName: string
  teams: CompanyTeamWithMembers[]
}
