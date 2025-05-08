
export type TaskType = "bug" | "feature" | "story" | "subtask" | string

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
  comments?: {
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
  }[]
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
