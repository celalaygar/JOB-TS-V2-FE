
export type TaskType = "bug" | "feature" | "story" | "subtask" | string

export interface Comment {
  id: string
  text: string
  content: string
  userId: string
  type: string
  author: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  createdAt: string
  isActivity?: boolean
}

export interface Task {
  id: string
  taskNumber: string
  title: string
  description: string
  acceptanceCriteria?: string
  status: "to-do" | "in-progress" | "review" | "done" | "completed"
  priority: "High" | "Medium" | "Low"
  taskType: TaskType
  project: string
  projectName: string
  assignee: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  sprint: "current" | "next" | "backlog" | string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  dueDate?: string
  estimatedHours?: number
  completedAt?: string
  parentTaskId?: string
  subtasks?: string[]
  comments?: Comment[]
  labels?: string[]
  attachments?: {
    id: string
    name: string
    url: string
    type: string
    size: number
    uploadedAt: string
    uploadedBy: {
      id: string
      name: string
    }
  }[]
}



export interface ProjectTask {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  systemStatus: ProjectTaskSystemStatus;
  priority: ProjectTaskPriority;
  taskType: ProjectTaskType;
  sprint: AssaignSprint;
  createdAt: string;
  projectTaskStatus: ProjectTaskStatusModel;
  // comments?: ProjectTaskComment[]; // Yorumlar eğer eklenirse
  parentTaskId: string;
  createdBy: CreatedBy;
  assignee: CreatedBy;
  createdProject: CreatedProject;
}

export enum ProjectTaskSystemStatus {
  ACTIVE = "ACTIVE",
  PASSIVE = "PASSIVE",
  DELETED = "DELETED",
}

export enum ProjectTaskPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum ProjectTaskType {
  BUG = "BUG",
  FEATURE = "FEATURE",
  STORY = "STORY",
}

export interface AssaignSprint {
  id: string;
  name: string;
}

export interface ProjectTaskStatusModel {
  id: string;
  name: string;
}

export interface CreatedBy {
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
