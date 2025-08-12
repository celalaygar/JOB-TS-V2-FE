import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { Project } from "@/types/project"



interface ProjectsState {
  projects: Project[]
  selectedProject: Project | null
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
}

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload
    },
    selectProject: (state, action: PayloadAction<Project>) => {
      state.selectedProject = action.payload || null
    },
    addProject: (state, action: PayloadAction<Project>) => {
      if (!state.projects) {
        state.projects = []
      }
      state.projects.push(action.payload)
    },
    updateProject: (state, action: PayloadAction<{ id: string; changes: Partial<Project> }>) => {
      const project = state.projects.find((project) => project.id === action.payload.id)
      if (project) {
        Object.assign(project, action.payload.changes)
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((project) => project.id !== action.payload)
      if (state.selectedProject?.id === action.payload) {
        state.selectedProject = null
      }
    },
  },
})

export const { setProjects, selectProject, addProject, updateProject, removeProject } = projectsSlice.actions
export default projectsSlice.reducer
