export type TaskStatus = "to-do" | "in-progress" | "review" | "done"
export type TaskPriority = "Low" | "Medium" | "High"
export type TaskType = "bug" | "feature" | "story" | "subtask"
export type SprintType = "current" | "next" | "backlog"

export interface TaskComment {
  id: string
  text: string
  author: {
    id: string
    name: string
    avatar?: string
    initials: string
  }
  createdAt: string
}

export interface TaskAssignee {
  id: string
  name: string
  avatar?: string
  initials: string
}

export interface Task {
  id: string
  taskNumber: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  taskType: TaskType
  project: string
  projectName: string
  assignee: TaskAssignee
  sprint: SprintType
  createdAt: string
  comments: TaskComment[]
  parentTaskId?: string
}

export const taskTypeColors = {
  bug: "bg-red-50 text-red-700 border-red-200",
  feature: "bg-blue-50 text-blue-700 border-blue-200",
  story: "bg-purple-50 text-purple-700 border-purple-200",
  subtask: "bg-gray-50 text-gray-700 border-gray-200",
}

export const taskTypeIcons = {
  bug: "Bug",
  feature: "Lightbulb",
  story: "BookOpen",
  subtask: "GitBranch",
}
