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

export interface Issue {
  id: string
  issueNumber: string
  title: string
  description: string
  status: string
  priority: string
  taskType: "bug" | "feature" | "story" | "subtask" // Added task type field
  project: string
  projectName: string
  assignee: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  sprint?: string
  createdAt: string
  comments?: Comment[]
  labels?: string[]
  parentIssueId?: string // For subtasks, reference to parent issue
}

export type TaskType = "bug" | "feature" | "story" | "subtask"

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
