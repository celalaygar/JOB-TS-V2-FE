import { ProjectTask, ProjectTaskType } from "@/types/task"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"



type TasksState = {
  tasks: ProjectTask[]
  selectedTask: ProjectTask | null
}

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
}

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<ProjectTask[]>) => {
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
    addTask: (state, action: PayloadAction<ProjectTask>) => {

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
