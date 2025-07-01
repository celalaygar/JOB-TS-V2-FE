import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { tasks } from "@/data/tasks"
import type { TaskType } from "@/types/task"
import { ProjectTaskStatus } from "@/types/project"

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

const initialState: TasksState = {
  tasks: tasks,
  selectedTask: null,
}

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
    },
    selectTask: (state, action: PayloadAction<string>) => {
      state.selectedTask = state.tasks.find((task) => task.id === action.payload) || null
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const task = state.tasks.find((task) => task.id === action.payload.id)
      if (task) {
        task.status = action.payload.status
      }
    },
    addTask: (state, action: PayloadAction<Task>) => {
      // If no taskNumber is provided, generate one
      if (!action.payload.taskNumber) {
        let prefix = ""

        // Set prefix based on task type
        switch (action.payload.taskType) {
          case "bug":
            prefix = "BUG"
            break
          case "feature":
            prefix = "FTR"
            break
          case "story":
            prefix = "STORY"
            break
          case "subtask":
            prefix = "SUB"
            break
          default:
            prefix = "PBI"
        }

        const randomNumber = Math.floor(Math.random() * 10000)
        action.payload.taskNumber = `${prefix}-${randomNumber}`
      }
      state.tasks.push(action.payload)
    },
    updateTask: (state, action: PayloadAction<{ id: string; changes: Partial<Task> }>) => {
      const task = state.tasks.find((task) => task.id === action.payload.id)
      if (task) {
        Object.assign(task, action.payload.changes)
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
      if (state.selectedTask?.id === action.payload) {
        state.selectedTask = null
      }
    },
    addComment: (state, action: PayloadAction<{ taskId: string; comment: Comment }>) => {
      const task = state.tasks.find((task) => task.id === action.payload.taskId)
      if (task) {
        if (!task.comments) {
          task.comments = []
        }
        task.comments.push(action.payload.comment)
      }
    },
    updateComment: (state, action: PayloadAction<{ taskId: string; commentId: string; changes: Partial<Comment> }>) => {
      const task = state.tasks.find((task) => task.id === action.payload.taskId)
      if (task && task.comments) {
        const comment = task.comments.find((c) => c.id === action.payload.commentId)
        if (comment) {
          Object.assign(comment, action.payload.changes)
        }
      }
    },
    deleteComment: (state, action: PayloadAction<{ taskId: string; commentId: string }>) => {
      const task = state.tasks.find((task) => task.id === action.payload.taskId)
      if (task && task.comments) {
        // Remove the comment and any replies to it
        task.comments = task.comments.filter(
          (c) => c.id !== action.payload.commentId && c.parentId !== action.payload.commentId,
        )
      }
    },
  },
})

export const {
  setTasks,
  selectTask,
  updateTaskStatus,
  addTask,
  updateTask,
  removeTask,
  addComment,
  updateComment,
  deleteComment,
} = tasksSlice.actions
export default tasksSlice.reducer
