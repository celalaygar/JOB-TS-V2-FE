export type IssueType = "bug" | "feature" | "improvement" | "task" | "epic" | "story"
export type IssuePriority = "low" | "medium" | "high" | "critical"
export type IssueStatus = "backlog" | "todo" | "in-progress" | "in-review" | "done" | "canceled"

export interface IssueComment {
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

export interface IssueAttachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
  uploadedBy: {
    id: string
    name: string
    avatar?: string
    initials: string
  }
}

export interface IssueActivity {
  id: string
  type: "comment" | "status-change" | "assignment" | "priority-change" | "attachment" | "created"
  user: {
    id: string
    name: string
    avatar?: string
    initials: string
  }
  timestamp: string
  data?: {
    from?: string
    to?: string
    comment?: string
    attachment?: IssueAttachment
  }
}

export interface Issue {
  id: string
  title: string
  description: string
  type: IssueType
  status: IssueStatus
  priority: IssuePriority
  assignee?: {
    id: string
    name: string
    avatar?: string
    initials: string
  }
  reporter: {
    id: string
    name: string
    avatar?: string
    initials: string
  }
  createdAt: string
  updatedAt: string
  dueDate?: string
  labels?: string[]
  project: {
    id: string
    name: string
  }
  sprint?: {
    id: string
    name: string
  }
  comments?: IssueComment[]
  attachments?: IssueAttachment[]
  activity?: IssueActivity[]
  subtasks?: Issue[]
  parent?: {
    id: string
    title: string
  }
  storyPoints?: number
  timeTracking?: {
    originalEstimate: number
    remainingEstimate: number
    timeSpent: number
  }
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
