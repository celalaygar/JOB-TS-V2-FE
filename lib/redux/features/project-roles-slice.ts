import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ProjectRole } from "@/types/project-role"

interface ProjectRolesState {
  roles: ProjectRole[]
  selectedRoleId: string | null
}

const initialState: ProjectRolesState = {
  roles: [],
  selectedRoleId: null,
}

const projectRolesSlice = createSlice({
  name: "projectRoles",
  initialState,
  reducers: {

    setProjectsRole: (state, action: PayloadAction<ProjectRole[]>) => {
      state.roles = action.payload
    },
    addRole: (state, action: PayloadAction<ProjectRole>) => {
      state.roles.push(action.payload)
    },
    updateRole: (state, action: PayloadAction<ProjectRole>) => {
      const index = state.roles.findIndex((role) => role.id === action.payload.id)
      if (index !== -1) {
        state.roles[index] = action.payload
      }
    },
    removeRole: (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter((role) => role.id !== action.payload)
    },
    selectRole: (state, action: PayloadAction<string>) => {
      state.selectedRoleId = action.payload
    },
    clearSelectedRole: (state) => {
      state.selectedRoleId = null
    },
    moveRoleUp: (state, action: PayloadAction<string>) => {
      const roleId = action.payload
      const projectId = state.roles.find((role) => role.id === roleId)?.projectId

      if (!projectId) return

      const projectRoles = state.roles.filter((role) => role.projectId === projectId)
      const roleIndex = projectRoles.findIndex((role) => role.id === roleId)

      if (roleIndex <= 0) return

      // Swap order values
      const currentRole = projectRoles[roleIndex]
      const previousRole = projectRoles[roleIndex - 1]

      if (currentRole && previousRole) {
        const currentOrder = currentRole.order || roleIndex + 1
        const previousOrder = previousRole.order || roleIndex

        // Update the roles in the main state array
        state.roles = state.roles.map((role) => {
          if (role.id === currentRole.id) {
            return { ...role, order: previousOrder }
          }
          if (role.id === previousRole.id) {
            return { ...role, order: currentOrder }
          }
          return role
        })
      }
    },
    moveRoleDown: (state, action: PayloadAction<string>) => {
      const roleId = action.payload
      const projectId = state.roles.find((role) => role.id === roleId)?.projectId

      if (!projectId) return

      const projectRoles = state.roles.filter((role) => role.projectId === projectId)
      const roleIndex = projectRoles.findIndex((role) => role.id === roleId)

      if (roleIndex === -1 || roleIndex >= projectRoles.length - 1) return

      // Swap order values
      const currentRole = projectRoles[roleIndex]
      const nextRole = projectRoles[roleIndex + 1]

      if (currentRole && nextRole) {
        const currentOrder = currentRole.order || roleIndex + 1
        const nextOrder = nextRole.order || roleIndex + 2

        // Update the roles in the main state array
        state.roles = state.roles.map((role) => {
          if (role.id === currentRole.id) {
            return { ...role, order: nextOrder }
          }
          if (role.id === nextRole.id) {
            return { ...role, order: currentOrder }
          }
          return role
        })
      }
    },
  },
})

export const { setProjectsRole, addRole, updateRole, removeRole, selectRole, clearSelectedRole, moveRoleUp, moveRoleDown } =
  projectRolesSlice.actions

export default projectRolesSlice.reducer
