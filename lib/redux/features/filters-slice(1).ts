import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FiltersState {
  projectFilter: string
  statusFilter: string
  priorityFilter: string
  assigneeFilter: string
  sprintFilter: string
  searchQuery: string
}

const initialState: FiltersState = {
  projectFilter: "all",
  statusFilter: "all",
  priorityFilter: "all",
  assigneeFilter: "all",
  sprintFilter: "all",
  searchQuery: "",
}

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setProjectFilter: (state, action: PayloadAction<string>) => {
      state.projectFilter = action.payload
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload
    },
    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.priorityFilter = action.payload
    },
    setAssigneeFilter: (state, action: PayloadAction<string>) => {
      state.assigneeFilter = action.payload
    },
    setSprintFilter: (state, action: PayloadAction<string>) => {
      state.sprintFilter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    resetFilters: (state) => {
      state.projectFilter = "all"
      state.statusFilter = "all"
      state.priorityFilter = "all"
      state.assigneeFilter = "all"
      state.sprintFilter = "all"
      state.searchQuery = ""
    },
  },
})

export const {
  setProjectFilter,
  setStatusFilter,
  setPriorityFilter,
  setAssigneeFilter,
  setSprintFilter,
  setSearchQuery,
  resetFilters,
} = filtersSlice.actions
export default filtersSlice.reducer
