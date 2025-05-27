import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { users } from "@/data/users"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  initials: string
  role: string
  department: string
  location: string
  lastActive: string
  projects: string[]
  tasks: string[]
  status: "active" | "inactive"
}

interface UsersState {
  users: User[]
}

const initialState: UsersState = {
  users: [],
}

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },
  },
})

export const { addUser, updateUser, deleteUser } = usersSlice.actions
export default usersSlice.reducer
