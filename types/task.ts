import { CreatedBy, CreatedProject, ProjectTaskStatus } from "./project"



export interface TaskUpdateRequest {
  id: string | number | undefined; // projectTask?.id olabilir, bu yüzden string | number | undefined
  title: string;
  description: string;
  projectTaskStatusId: string | number;
  priority: string;
  taskType: TaskType; // zaten senin projenizde tanımlı olmalı
  projectId: string | number;
  assigneeId: string | number;
  sprintId: string | number | null;
  parentTaskId: string | number | null;
}

// Ortak özelliklere sahip nesneler için temel bir arayüz
interface IdName {
  id: string;
  name: string;
}

// Enum benzeri yapılar için arayüz
interface EnumValue {
  id: number;
  en: string;
  tr: string;
}

// Java'daki enum'lara karşılık gelen sabit değerler

export const ProjectTaskSystemStatuses: Record<ProjectTaskSystemStatus, EnumValue> = {
  ACTIVE: { id: 1, en: 'ACTIVE', tr: 'AKTİF' },
  PASSIVE: { id: 2, en: 'PASSIVE', tr: 'PASİF' },
  DELETED: { id: 3, en: 'DELETED', tr: 'SİLİNMİLŞ' },
};

export const ProjectTaskPriorities: Record<ProjectTaskPriority, EnumValue> = {
  CRITICAL: { id: 1, en: 'CRITICAL', tr: 'KIRİTİK' },
  HIGH: { id: 1, en: 'PLANNED', tr: 'YÜKSEK' },
  MEDIUM: { id: 2, en: 'MEDIUM', tr: 'ORTA' },
  LOW: { id: 3, en: 'LOW', tr: 'DÜŞÜK' },
};

export const ProjectTaskTypes: Record<ProjectTaskType, EnumValue> = {
  BUG: { id: 1, en: 'BUG', tr: 'BUG' },
  FEATURE: { id: 2, en: 'FEATURE', tr: 'ÖZELLİK' },
  SUBTASK: { id: 2, en: 'SUBTASK', tr: 'ALT TASK' },
  STORY: { id: 3, en: 'STORY', tr: 'HİKAYE' },
};

// ---
// Diğer arayüzler
// ---


export interface ProjectTaskStatusModel {
  id: string;
  name: string;
  label: string;
  turkish: string;
  english: string;
  color: string;
}


export interface ParentTask {
  id: string;
  taskNumber: string;
  title: string;
}

export interface AssaignSprint extends IdName { }

// ---
// Ana DTO arayüzü
// ---

export interface Task {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  systemStatus: ProjectTaskSystemStatus;
  priority: ProjectTaskPriority;
  taskType: ProjectTaskType;
  sprint: AssaignSprint;
  createdAt: string;
  parentTaskId?: string;
  createdBy: CreatedBy;
  assignee: CreatedBy;
  projectTaskStatus: ProjectTaskStatusModel;
  createdProject: CreatedProject;
  parentTask: ParentTask;
}

export interface TaskCommentRequest {
  taskId: string
  projectId: string
  comment: string
  userIds: string[] | null
}

export interface ProjectTaskComment {
  id: string;
  taskId: string;
  comment: string;
  description: string;
  createdBy: CreatedBy;
  createdProject: CreatedProject;
  createdAt: string
  updatedAt: string
}




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



export interface ProjectTaskFilterRequest {
  search: string;
  taskNumber: string;
  title: string;
  description: string;
  projectTaskStatusId: string;
  projectId: string;
  assigneeId: string | undefined;
  priority: ProjectTaskPriority | string;
  taskType: ProjectTaskType | string;
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
  status: string | null;
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
  SUBTASK = "SUBTASK",
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