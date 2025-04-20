import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { sprints } from "@/data/sprints"

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "planned" | "active" | "completed"
  totalIssues: number
  completedIssues: number
  team: {
    name: string
    avatar: string
    initials: string
  }[]
}

interface SprintsState {
  sprints: Sprint[]
  selectedSprint: Sprint | null
}

const initialState: SprintsState = {
  sprints: sprints,
  selectedSprint: null,
}

export const sprintsSlice = createSlice({
  name: "sprints",
  initialState,
  reducers: {
    setSprints: (state, action: PayloadAction<Sprint[]>) => {
      state.sprints = action.payload
    },
    selectSprint: (state, action: PayloadAction<string>) => {
      state.selectedSprint = state.sprints.find((sprint) => sprint.id === action.payload) || null
    },
    addSprint: (state, action: PayloadAction<Sprint>) => {
      state.sprints.push(action.payload)
    },
    updateSprint: (state, action: PayloadAction<{ id: string; changes: Partial<Sprint> }>) => {
      const sprint = state.sprints.find((sprint) => sprint.id === action.payload.id)
      if (sprint) {
        Object.assign(sprint, action.payload.changes)
      }
    },
    removeSprint: (state, action: PayloadAction<string>) => {
      state.sprints = state.sprints.filter((sprint) => sprint.id !== action.payload)
    },
  },
})

export const { setSprints, selectSprint, addSprint, updateSprint, removeSprint } = sprintsSlice.actions
export default sprintsSlice.reducer
