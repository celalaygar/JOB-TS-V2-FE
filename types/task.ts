export interface Task {
  id: string
  taskNumber: string
  title: string
  description: string
  acceptanceCriteria?: string
  status: "to-do" | "in-progress" | "review" | "done"
  priority: "High" | "Medium" | "Low"
  taskType: "bug" | "feature" | "story" | "subtask" | string
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
  dueDate?: string
  estimatedHours?: number
  completedAt?: string
  parentTaskId?: string
  subtasks?: string[]
  comments?: {
    id: string
    text: string
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
