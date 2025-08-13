import { Sprint } from "@/types/sprint"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"



interface SprintsState {
  sprints: Sprint[]
  selectedSprint: Sprint | null
  singleSprint: Sprint | null
}

const initialState: SprintsState = {
  sprints: [],
  selectedSprint: null,
  singleSprint: null
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
    setSingleSprint: (state, action: PayloadAction<Sprint>) => {
      state.singleSprint = action.payload
    },
    updateSingleSprint: (state, action: PayloadAction<Sprint>) => {
      state.singleSprint = action.payload
    },
    addSprint: (state, action: PayloadAction<Sprint>) => {
      state.sprints.push(action.payload)
    },
    updateSprint: (state, action: PayloadAction<string>) => {
      const sprint = state.sprints.find((sprint) => sprint.id === action.payload.id)
      if (sprint) {
        Object.assign(sprint, action.payload)
      }
    },
    removeSprint: (state, action: PayloadAction<string>) => {
      state.sprints = state.sprints.filter((sprint) => sprint.id !== action.payload)
    },
  },
})

export const { setSprints, selectSprint, setSingleSprint, updateSingleSprint, addSprint, updateSprint, removeSprint } = sprintsSlice.actions
export default sprintsSlice.reducer
