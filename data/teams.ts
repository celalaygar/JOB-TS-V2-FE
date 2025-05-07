import type { TeamMember, Team, TeamWithMembers, ProjectWithTeams, TeamMemberStatus } from "../types/team"
import { users } from "./users"
import { projects } from "./projects"

export type { TeamMemberStatus, TeamMember, Team, TeamWithMembers, ProjectWithTeams }

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

// Create teams data
export const teams: Team[] = [
  {
    id: "team-1",
    projectId: "project-1",
    projectName: "Website Redesign",
    name: "Frontend Team",
    description: "Responsible for implementing the new website design and user interface",
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
    id: "team-2",
    projectId: "project-1",
    projectName: "Website Redesign",
    name: "Backend Team",
    description: "Responsible for API development and database architecture",
    members: generateTeamMembers(["user-4", "user-8", "user-9"], {
      "user-4": "Team Lead",
      "user-8": "Senior Backend Developer",
      "user-9": "Database Administrator",
    }),
    createdAt: "2023-01-15T08:30:00.000Z",
    updatedAt: "2023-06-18T11:45:00.000Z",
  },
  {
    id: "team-3",
    projectId: "project-2",
    projectName: "Mobile App",
    name: "Mobile Development Team",
    description: "Responsible for developing the cross-platform mobile application",
    members: generateTeamMembers(["user-2", "user-4", "user-6", "user-9"], {
      "user-2": "Mobile Lead",
      "user-4": "Senior Developer",
      "user-6": "QA Engineer",
      "user-9": "Junior Developer",
    }),
    createdAt: "2023-02-10T09:15:00.000Z",
    updatedAt: "2023-07-05T16:20:00.000Z",
  },
  {
    id: "team-4",
    projectId: "project-3",
    projectName: "API Development",
    name: "API Team",
    description: "Responsible for designing and implementing RESTful APIs",
    members: generateTeamMembers(["user-1", "user-4", "user-8", "user-10"], {
      "user-1": "API Architect",
      "user-4": "Senior Developer",
      "user-8": "Developer",
      "user-10": "QA Engineer",
    }),
    createdAt: "2023-03-05T10:00:00.000Z",
    updatedAt: "2023-07-12T13:10:00.000Z",
  },
  {
    id: "team-5",
    projectId: "project-4",
    projectName: "E-commerce Platform",
    name: "E-commerce Team",
    description: "Responsible for building the online store and checkout system",
    members: generateTeamMembers(["user-3", "user-5", "user-7", "user-9", "user-10"], {
      "user-3": "Team Lead",
      "user-5": "Frontend Developer",
      "user-7": "Product Owner",
      "user-9": "Backend Developer",
      "user-10": "QA Engineer",
    }),
    createdAt: "2023-04-20T11:30:00.000Z",
    updatedAt: "2023-08-01T09:45:00.000Z",
  },
  {
    id: "team-6",
    projectId: "project-5",
    projectName: "Analytics Dashboard",
    name: "Analytics Team",
    description: "Responsible for creating real-time analytics dashboards",
    members: generateTeamMembers(["user-2", "user-6", "user-8"], {
      "user-2": "Data Scientist",
      "user-6": "Frontend Developer",
      "user-8": "Backend Developer",
    }),
    createdAt: "2023-05-15T13:45:00.000Z",
    updatedAt: "2023-08-10T15:30:00.000Z",
  },
]

// Group teams by project
export const teamsByProject = teams.reduce(
  (acc, team) => {
    if (!acc[team.projectId]) {
      acc[team.projectId] = {
        projectId: team.projectId,
        projectName: team.projectName,
        teams: [],
      }
    }

    acc[team.projectId].teams.push(team)
    return acc
  },
  {} as Record<string, { projectId: string; projectName: string; teams: Team[] }>,
)

// Convert to array for easier mapping
export const projectsWithTeams = Object.values(teamsByProject)

// Function to get a team by ID
export const getTeamById = (teamId: string): Team | undefined => {
  return teams.find((team) => team.id === teamId)
}

// Function to get teams by project ID
export const getTeamsByProjectId = (projectId: string): Team[] => {
  return teams.filter((team) => team.projectId === projectId)
}

// Function to get project by ID
export const getProjectById = (projectId: string) => {
  return projects.find((project) => project.id === projectId)
}
