import { CreatedBy, CreatedProject } from "./project";

//export type SprintStatus = "planned" | "active" | "completed" | "planning" | "cancelled"


// SprintStatus.ts veya benzeri bir dosya
export enum SprintType {
  PROJECT = "PROJECT",
  TEAM = "TEAM"
}
export interface SprintTeamMember {
  name: string
  avatar?: string
  initials: string
}




export interface SprintCreatedUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
}


export interface TaskStatusOnCompletion {
  id: string;
  name: string;
  label: string;
  turkish: string;
  english: string;
  order: number;
  createdProject: CreatedProject;
  createdBy: SprintCreatedUser;
}



// SprintStatus.ts veya benzeri bir dosya
export enum SprintStatus {
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED", // Java'daki "COMPLATED" yazım hatasını "COMPLETED" olarak düzelttim
}

// Sprint.ts veya arayüzünüzün bulunduğu dosya
export interface Sprint {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  startDate: string;
  endDate: string;
  status: SprintStatus; // Artık enum tipini kullanıyoruz
  completionStatus?: string;
  sprintType?: string;
  teamId?: string;
  totalIssues: number;
  completedIssues: number;
  team: SprintTeamMember[];
  tasks?: any[];
  createdProject: CreatedProject;
  sprintCode: string;
  sprintStatus: string; // Bu alanı muhtemelen yukarıdaki 'status' alanı ile birleştirmek isteyebilirsiniz
  taskStatusOnCompletion: TaskStatusOnCompletion;
  createdBy: SprintCreatedUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface SprintTaskAddRequest {
  sprintId: string;
  taskId: string;
  projectId: string;
}

export interface UpdateSprintStatusRequest {
  sprintId: string;
  newStatus: string;
}
export interface SprintRequest {
  sprintId: string;
}
export interface SprintTaskRemoveRequest {
  sprintId: string;
  taskId: string;
  projectId: string;
}

export interface CompletionResponseDto {
  success: boolean;
  message: string;
  sprint: Sprint;
}



export interface SprintTaskGetAllRequest {
  sprintId: string;
  projectId: string;
}


export interface AddUserToSprintRequest {
  sprintId: string;
  projectId: string;
  userIds: string[]
}

export interface RemoveUserFromSprintRequest {
  sprintId: string;
  projectId: string;
  userIds: string[]
}

export enum SprintUserSystemRole {
  SPRINT_ADMIN = "SPRINT_ADMIN",
  SPRINT_MEMBER = "SPRINT_MEMBER"
}

export interface SprintUser {
  id: string;
  sprintId: string;
  projectId: string;
  createdBy: CreatedBy;
  createdProject: CreatedProject;
  assignmentDate: string; // Instant → ISO date string format
  sprintUserSystemRole: string
  notes: string;
  createdAt: string; // LocalDateTime → ISO date string
  updatedAt: string; // LocalDateTime → ISO date string
}