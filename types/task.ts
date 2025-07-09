import { ProjectTaskStatus } from "./project"

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


export interface ProjectTaskFilterRequest {
  taskNumber: string;
  title: string;
  description: string;
  projectTaskStatusId: string;
  projectId: string;
  assigneeId: string;
  priority: ProjectTaskPriority;
  taskType: ProjectTaskType;
}

export interface TaskResponse {
  content: ProjectTask[];
  totalElements: number;
  page: number;
  size: number;
}
export interface ParentTask {
  id: string;
  taskNumber: string;
  title: string;
}

export interface ProjectTask {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  systemStatus: ProjectTaskSystemStatus;
  projectTaskStatus: ProjectTaskStatusModel;
  priority: ProjectTaskPriority;
  taskType: ProjectTaskType;
  sprint: AssaignSprint;
  createdAt: string;
  // comments?: ProjectTaskComment[]; // Yorumlar eğer eklenirse
  parentTaskId: string;
  parentTask: ParentTask | null;
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
  CRITICAL = "CRITICAL",
}

export enum ProjectTaskType {
  BUG = "BUG",
  FEATURE = "FEATURE",
  STORY = "STORY",
  SUBTASK = "STORY",
}

export interface AssaignSprint {
  id: string;
  name: string;
}

export interface ProjectTaskStatusModel {
  id: string;
  name: string;
  label: string;
  turkish: string;
  english: string;
  color: string;
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




export interface Comment {
  id: string
  text: string
  author: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  createdAt: string
  editedAt?: string
  parentId?: string
  isActivity?: boolean
}

export interface Task {
  id: string | null
  taskNumber: string | null
  title: string
  description: string
  status: string
  priority: string
  taskType: TaskType
  projectId: string
  project: string
  projectName: string
  projectTaskStatusId: string
  projectTaskStatus: ProjectTaskStatus | undefined
  assignee: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  sprint?: string
  createdAt: string
  comments?: Comment[]
  parentTaskId?: string
}



export interface TaskCreateRequest {
  id: string | null
  taskNumber: string | null
  title: string
  description: string
  priority: string
  taskType: TaskType
  projectId: string
  projectTaskStatusId: string
  assigneeId: string
  assignee: {
    id: string
    email: string
  } | null
  sprintId?: string
  parentTaskId?: string
}
interface TasksState {
  tasks: Task[]
  selectedTask: Task | null
}