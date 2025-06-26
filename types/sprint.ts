//export type SprintStatus = "planned" | "active" | "completed" | "planning" | "cancelled"
export type SprintType = "standard" | "project-team"

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

export interface CreatedProject {
  id: string;
  name: string;
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
  sprintType?: SprintType;
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

// Diğer tanımlamalarınız (SprintType, SprintTeamMember, CreatedProject, TaskStatusOnCompletion, SprintCreatedUser)
// Bu örnekte yer almadığı için olduğu gibi bırakıldı.