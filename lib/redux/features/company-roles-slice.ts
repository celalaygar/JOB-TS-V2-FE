import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CompanyRole } from "@/types/company-role"
import { companyRoles } from "@/data/company-roles"
import { v4 as uuidv4 } from "uuid"

interface CompanyRolesState {
  roles: CompanyRole[]
  loading: boolean
  error: string | null
}

const initialState: CompanyRolesState = {
  roles: companyRoles,
  loading: false,
  error: null,
}

const companyRolesSlice = createSlice({
  name: "companyRoles",
  initialState,
  reducers: {
    addCompanyRole: (state, action: PayloadAction<Omit<CompanyRole, "id" | "createdAt" | "updatedAt">>) => {
      const newRole: CompanyRole = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.roles.push(newRole)
    },
    updateCompanyRole: (state, action: PayloadAction<CompanyRole>) => {
      const index = state.roles.findIndex((role) => role.id === action.payload.id)
      if (index !== -1) {
        state.roles[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteCompanyRole: (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter((role) => role.id !== action.payload)
    },
  },
})

export const { addCompanyRole, updateCompanyRole, deleteCompanyRole } = companyRolesSlice.actions
export default companyRolesSlice.reducer
