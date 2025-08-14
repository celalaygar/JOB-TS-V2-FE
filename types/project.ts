import { Team } from "./team"

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

export interface CreatedUser {
  id: string
  userId: string
  firstname: string
  lastname: string
  username: string
  email: string
  role?: string
  avatar?: string
  initials?: string
  department?: string
  phone?: string
  title?: string
  status?: string
  joinDate?: string
  skills?: string[]
  languages?: string[]
  certifications?: string[]
  education?: string[]
  location?: string
  workHours?: string
}
export interface ProjectSprint {
  id: string
  name: string
  status: string
  startDate: string
  endDate: string
  progress: number
}

export interface Backlog {
  id: string
}
export interface Project {
  id: string
  name: string
  description: string
  status: string
  progress?: number
  issueCount?: number
  openIssues?: number
  //team: ProjectTeamMember[] | null
  leadId?: string
  startDate?: string
  endDate?: string
  priority?: string
  tags?: string[]
  repository?: string
  sprintCount?: number
  milestoneCount?: number
  recentSprints?: ProjectSprint[]
  backlog?: Backlog | null
  createdBy?: CreatedUser | null
  projectTeams?: ProjectTeam[] | null
  sprints?: ProjectSprint[] | null
  users?: CreatedUser[] | null
}


export interface ProjectRole {
  id: string
  projectId: string
  name: string
  description: string
  permissions: string[]
  isDefaultRole: boolean
}

export interface ProjectTaskStatus {
  id: string
  projectId: string | null
  name: string
  label: string
  color: string
  order: number
  turkish: string
  english: string
}


export interface ProjectTeam {
  id: string;
  name: string;
  description: string;
  createdProject: CreatedProject;
  createdBy: CreatedBy;
}



export interface CreatedProject {
  id: string;
  name: string;
}


export interface CreatedBy {
  id: string;
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
}

export interface RemoveProjectUserRequest {
  userId: string;
  projectUserId: string;
  projectId: string;
}
export enum ProjectSystemRole {
  PROJECT_ADMIN = "PROJECT_ADMIN",
  PROJECT_USER = "PROJECT_USER",
  PROJECT_OWNER = "PROJECT_OWNER",
  PROJECT_PASSIVE_USER = "PROJECT_PASSIVE_USER",
  PROJECT_DELETED_USER = "PROJECT_DELETED_USER",
  PROJECT_REMOVED_USER = "PROJECT_REMOVED_USER"
}


export interface ProjectUser {
  id: string;
  userId: string;
  projectId: string;
  email: string;
  firstname: string;
  lastname: string;
  username?: string | null;
  password?: string | null;
  projectSystemRole?: string | null;
  name?: string | null;
  initials?: string | null;
  teamRole?: string | null;
  companyRole?: string | null;
  status?: string | null;
  department?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null; // ISO string format
  gender?: string | null; // e.g., "MALE", "other"
  position?: string | null;
  company?: string | null;
  createdAt?: string | null; // ISO string format
  updatedAt?: string | null; // ISO string format
}
