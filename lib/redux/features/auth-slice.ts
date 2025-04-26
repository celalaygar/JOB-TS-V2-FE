import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { users } from "@/data/users"

interface AuthState {
  isAuthenticated: boolean
  currentUser: {
    id: string
    name: string
    email: string
    role: string
    avatar: string
    initials: string
  } | null
  error: string | null
  loading: boolean
}

// Check if user is already logged in from localStorage
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        return {
          isAuthenticated: true,
          currentUser: user,
          error: null,
          loading: false,
        }
      } catch (e) {
        // Invalid stored data
        localStorage.removeItem("currentUser")
      }
    }
  }

  return {
    isAuthenticated: false,
    currentUser: null,
    error: null,
    loading: false,
  }
}

const initialState: AuthState = getInitialState()

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        id: string
        name: string
        email: string
        role: string
        avatar: string
        initials: string
      }>,
    ) => {
      state.isAuthenticated = true
      state.currentUser = action.payload
      state.loading = false
      state.error = null

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(action.payload))
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.currentUser = null

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentUser")
      }
    },
    registerStart: (state) => {
      state.loading = true
      state.error = null
    },
    registerSuccess: (
      state,
      action: PayloadAction<{
        id: string
        name: string
        email: string
        role: string
        avatar: string
        initials: string
      }>,
    ) => {
      state.isAuthenticated = true
      state.currentUser = users[0]
      state.loading = false
      state.error = null

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(action.payload))
      }
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

// Async thunks for login and register
export const login = (email: string, password: string) => (dispatch: any) => {
  dispatch(authSlice.actions.loginStart())

  // Simulate API call
  setTimeout(() => {
    // Find user with matching email (in a real app, you'd check password hash)
    const user = users[0]

    if (user) {
      dispatch(authSlice.actions.loginSuccess(user))
    } else {
      dispatch(authSlice.actions.loginFailure("Invalid email or password"))
    }
  }, 1000)
}

export const register =
  (name: string, email: string, password: string, role = "Developer", department = "Engineering") =>
  (dispatch: any) => {
    dispatch(authSlice.actions.registerStart())

    // Simulate API call
    setTimeout(() => {
      // Check if email already exists
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (existingUser) {
        dispatch(authSlice.actions.registerFailure("Email already in use"))
        return
      }

      // Generate initials from name
      const nameParts = name.split(" ")
      const initials =
        nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}` : nameParts[0].substring(0, 2)

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        avatar: "/placeholder.svg",
        initials: initials.toUpperCase(),
        department,
      }

      // In a real app, you would add this user to the database
      // For this demo, we'll just log in with the new user
      dispatch(authSlice.actions.registerSuccess(newUser))
    }, 1000)
  }

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
} = authSlice.actions
export default authSlice.reducer
