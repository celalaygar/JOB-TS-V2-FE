import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { issues } from "@/data/issues"
import type { TaskType } from "@/types/issue"

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
  taskType: TaskType
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
  parentIssueId?: string
}

interface IssuesState {
  issues: Issue[]
  selectedIssue: Issue | null
}

const initialState: IssuesState = {
  issues: issues,
  selectedIssue: null,
}

export const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<Issue[]>) => {
      state.issues = action.payload
    },
    selectIssue: (state, action: PayloadAction<string>) => {
      state.selectedIssue = state.issues.find((issue) => issue.id === action.payload) || null
    },
    updateIssueStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const issue = state.issues.find((issue) => issue.id === action.payload.id)
      if (issue) {
        issue.status = action.payload.status
      }
    },
    addIssue: (state, action: PayloadAction<Issue>) => {
      // If no issueNumber is provided, generate one
      if (!action.payload.issueNumber) {
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
        action.payload.issueNumber = `${prefix}-${randomNumber}`
      }
      state.issues.push(action.payload)
    },
    updateIssue: (state, action: PayloadAction<{ id: string; changes: Partial<Issue> }>) => {
      const issue = state.issues.find((issue) => issue.id === action.payload.id)
      if (issue) {
        Object.assign(issue, action.payload.changes)
      }
    },
    removeIssue: (state, action: PayloadAction<string>) => {
      state.issues = state.issues.filter((issue) => issue.id !== action.payload)
      if (state.selectedIssue?.id === action.payload) {
        state.selectedIssue = null
      }
    },
    addComment: (state, action: PayloadAction<{ issueId: string; comment: Comment }>) => {
      const issue = state.issues.find((issue) => issue.id === action.payload.issueId)
      if (issue) {
        if (!issue.comments) {
          issue.comments = []
        }
        issue.comments.push(action.payload.comment)
      }
    },
    updateComment: (
      state,
      action: PayloadAction<{ issueId: string; commentId: string; changes: Partial<Comment> }>,
    ) => {
      const issue = state.issues.find((issue) => issue.id === action.payload.issueId)
      if (issue && issue.comments) {
        const comment = issue.comments.find((c) => c.id === action.payload.commentId)
        if (comment) {
          Object.assign(comment, action.payload.changes)
        }
      }
    },
    deleteComment: (state, action: PayloadAction<{ issueId: string; commentId: string }>) => {
      const issue = state.issues.find((issue) => issue.id === action.payload.issueId)
      if (issue && issue.comments) {
        // Remove the comment and any replies to it
        issue.comments = issue.comments.filter(
          (c) => c.id !== action.payload.commentId && c.parentId !== action.payload.commentId,
        )
      }
    },
  },
})

export const {
  setIssues,
  selectIssue,
  updateIssueStatus,
  addIssue,
  updateIssue,
  removeIssue,
  addComment,
  updateComment,
  deleteComment,
} = issuesSlice.actions
export default issuesSlice.reducer
