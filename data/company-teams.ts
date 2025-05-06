import { companies } from "./companies"
import { users } from "./users"

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

// export interface CompanyWithTeams {
//   companyId: string
//   companyName: string
//   teams: CompanyTeamWithMembers[]
// }

// Generate team members from users
const generateTeamMembers = (userIds: string[], teamRoles: Record<string, string>): TeamMember[] => {
  return userIds
    .map((userId) => {
      const user = users.find((u) => u.id === userId)
      if (!user) return null

      return {
        id: `team-member-${userId}`,
        userId: userId,
        name: user.name,
        email: user.email,
        role: teamRoles[userId] || user.role,
        status: "Active" as TeamMemberStatus,
        avatar: user.avatar,
        initials: user.initials,
        department: user.department,
        phone: user.phone,
        joinedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      }
    })
    .filter(Boolean) as TeamMember[]
}

// Create company teams data
export const companyTeams: CompanyTeam[] = [
  {
    id: "cteam-1",
    companyId: "1",
    companyName: "Tech Innovations Inc.",
    name: "Development Team",
    description: "Core development team responsible for product development",
    members: generateTeamMembers(["user-1", "user-2", "user-3", "user-5"], {
      "user-1": "Team Lead",
      "user-2": "Senior Developer",
      "user-3": "Developer",
      "user-5": "UI/UX Designer",
    }),
    createdAt: "2023-01-15T08:00:00.000Z",
    updatedAt: "2023-06-20T14:30:00.000Z",
  },
  {
    id: "cteam-2",
    companyId: "1",
    companyName: "Tech Innovations Inc.",
    name: "Marketing Team",
    description: "Team responsible for marketing and promotion",
    members: generateTeamMembers(["user-4", "user-8", "user-9"], {
      "user-4": "Marketing Lead",
      "user-8": "Content Creator",
      "user-9": "Social Media Specialist",
    }),
    createdAt: "2023-01-15T08:30:00.000Z",
    updatedAt: "2023-06-18T11:45:00.000Z",
  },
  {
    id: "cteam-3",
    companyId: "2",
    companyName: "HealthPlus Medical",
    name: "Research Team",
    description: "Medical research and development team",
    members: generateTeamMembers(["user-2", "user-4", "user-6", "user-9"], {
      "user-2": "Research Lead",
      "user-4": "Senior Researcher",
      "user-6": "Lab Technician",
      "user-9": "Data Analyst",
    }),
    createdAt: "2023-02-10T09:15:00.000Z",
    updatedAt: "2023-07-05T16:20:00.000Z",
  },
  {
    id: "cteam-4",
    companyId: "3",
    companyName: "Global Finance Partners",
    name: "Investment Team",
    description: "Team focused on investment strategies and portfolio management",
    members: generateTeamMembers(["user-1", "user-4", "user-8", "user-10"], {
      "user-1": "Investment Director",
      "user-4": "Senior Analyst",
      "user-8": "Financial Advisor",
      "user-10": "Risk Manager",
    }),
    createdAt: "2023-03-05T10:00:00.000Z",
    updatedAt: "2023-07-12T13:10:00.000Z",
  },
  {
    id: "cteam-5",
    companyId: "4",
    companyName: "EduLearn Academy",
    name: "Curriculum Team",
    description: "Team responsible for developing educational curriculum",
    members: generateTeamMembers(["user-3", "user-5", "user-7", "user-9", "user-10"], {
      "user-3": "Curriculum Director",
      "user-5": "Content Developer",
      "user-7": "Educational Consultant",
      "user-9": "Subject Matter Expert",
      "user-10": "Quality Assurance",
    }),
    createdAt: "2023-04-20T11:30:00.000Z",
    updatedAt: "2023-08-01T09:45:00.000Z",
  },
  {
    id: "cteam-6",
    companyId: "5",
    companyName: "Retail Dynamics",
    name: "Sales Team",
    description: "Team focused on sales and customer relationships",
    members: generateTeamMembers(["user-2", "user-6", "user-8"], {
      "user-2": "Sales Director",
      "user-6": "Account Manager",
      "user-8": "Sales Representative",
    }),
    createdAt: "2023-05-15T13:45:00.000Z",
    updatedAt: "2023-08-10T15:30:00.000Z",
  },
]

// Group teams by company
export const teamsByCompany = companyTeams.reduce(
  (acc, team) => {
    if (!acc[team.companyId]) {
      acc[team.companyId] = {
        companyId: team.companyId,
        companyName: team.companyName,
        teams: [],
      }
    }

    acc[team.companyId].teams.push(team)
    return acc
  },
  {} as Record<string, { companyId: string; companyName: string; teams: CompanyTeam[] }>,
)

// Convert to array for easier mapping
export const companiesWithTeams = Object.values(teamsByCompany)

// Function to get a team by ID
export const getCompanyTeamById = (teamId: string): CompanyTeam | undefined => {
  return companyTeams.find((team) => team.id === teamId)
}

// Function to get teams by company ID
export const getTeamsByCompanyId = (companyId: string): CompanyTeam[] => {
  return companyTeams.filter((team) => team.companyId === companyId)
}

// Function to get company by ID
export const getCompanyById = (companyId: string) => {
  return companies.find((company) => company.id === companyId)
}
