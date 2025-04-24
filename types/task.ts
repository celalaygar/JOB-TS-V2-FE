export type TaskStatus = "to-do" | "in-progress" | "review" | "done"
export type TaskPriority = "Low" | "Medium" | "High"
export type TaskType = "bug" | "feature" | "story" | "subtask"
export type SprintType = "current" | "next" | "backlog"

export interface TaskStatusOption {
  id: number
  value: "to-do" | "in-progress" | "review" | "done"
  label: string
}

export interface TaskPriorityOption {
  id: number
  value: "Low" | "Medium" | "High"
  label: string
}

export interface TaskTypeOption {
  id: number
  value: "bug" | "feature" | "story" | "subtask"
  label: string
  colorClass: string
  icon: string
}

export interface SprintTypeOption {
  id: number
  value: "current" | "next" | "backlog"
  label: string
}


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

export interface TaskUser {
  userId: number
  id: number
  name: string
  avatar?: string
  initials: string
  role?: string
  systemRole?: string
  teamRole?: string
  companyRole?: string
  status?: string
  email: string
  department?: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  position?: string
  company?: string
}

export interface TaskFile {
  id: string
  name: string
  path: string
  mimeType: string
}

export interface Task {
  id: string
  taskNumber: string
  title: string
  description: string
  status: TaskStatus | TaskStatusOption
  priority: TaskPriority | TaskPriorityOption
  taskType: TaskType | TaskTypeOption
  project: string
  projectId?: string
  projectName: string
  assignee: TaskUser
  sprint: SprintType | SprintTypeOption
  createdAt: string
  createdBy?: TaskUser
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
export const taskStatusOptions: TaskStatusOption[] = [
  { id: 1, value: "to-do", label: "To Do" },
  { id: 2, value: "in-progress", label: "In Progress" },
  { id: 3, value: "review", label: "Review" },
  { id: 4, value: "done", label: "Done" },
]
export const taskPriorityOptions: TaskPriorityOption[] = [
  { id: 5, value: "Low", label: "Low" },
  { id: 6, value: "Medium", label: "Medium" },
  { id: 7, value: "High", label: "High" },
]
export const taskTypeOptions: TaskTypeOption[] = [
  { id: 1, value: "bug", label: "Bug", colorClass: "bg-red-50 text-red-700 border-red-200", icon: "Bug" },
  { id: 2, value: "feature", label: "Feature", colorClass: "bg-blue-50 text-blue-700 border-blue-200", icon: "Lightbulb" },
  { id: 3, value: "story", label: "Story", colorClass: "bg-purple-50 text-purple-700 border-purple-200", icon: "BookOpen" },
  { id: 4, value: "subtask", label: "Subtask", colorClass: "bg-gray-50 text-gray-700 border-gray-200", icon: "GitBranch" },
]
export const sprintTypeOptions: SprintTypeOption[] = [
  { id: 2, value: "current", label: "Current Sprint" },
  { id: 6, value: "next", label: "Next Sprint" },
  { id: 1, value: "backlog", label: "Backlog" },
]