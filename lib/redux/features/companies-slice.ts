import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { companies, type Company } from "@/data/companies"

interface CompaniesState {
  companies: Company[]
  isLoading: boolean
  error: string | null
}

const initialState: CompaniesState = {
  companies: companies,
  isLoading: false,
  error: null,
}

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload)
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const index = state.companies.findIndex((company) => company.id === action.payload.id)
      if (index !== -1) {
        state.companies[index] = action.payload
      }
    },
    deleteCompany: (state, action: PayloadAction<string>) => {
      state.companies = state.companies.filter((company) => company.id !== action.payload)
    },
  },
})

export const { setLoading, setError, setCompanies, addCompany, updateCompany, deleteCompany } = companiesSlice.actions

export default companiesSlice.reducer
