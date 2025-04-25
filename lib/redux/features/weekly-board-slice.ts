import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface HourlyIssue {
  id: string
  title: string
  description?: string
  projectId?: string
  projectName?: string
  hour: number // 0-23
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  userId: string
  userName: string
  userAvatar: string
  userInitials: string
  color?: string
  createdAt: string
  completed: boolean
}

interface WeeklyBoardState {
  hourlyIssues: HourlyIssue[]
  selectedWeek: string // ISO date string of the Monday of the selected week
}

// Generate a color based on project ID
const getColorForProject = (projectId?: string): string => {
  if (!projectId) return "bg-gray-200"

  const colors = [
    "bg-blue-100 border-blue-300 text-blue-800",
    "bg-green-100 border-green-300 text-green-800",
    "bg-purple-100 border-purple-300 text-purple-800",
    "bg-yellow-100 border-yellow-300 text-yellow-800",
    "bg-pink-100 border-pink-300 text-pink-800",
    "bg-indigo-100 border-indigo-300 text-indigo-800",
    "bg-red-100 border-red-300 text-red-800",
    "bg-orange-100 border-orange-300 text-orange-800",
  ]

  // Simple hash function to get a consistent color for a project
  const hash = projectId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// Get the current week's Monday
const getCurrentWeekMonday = (): string => {
  const now = new Date()
  const day = now.getDay() // 0 is Sunday, 1 is Monday, etc.
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString()
}

// Generate sample hourly issues for the current week
const generateSampleHourlyIssues = (): HourlyIssue[] => {
  const users = [
    {
      id: "user-1",
      name: "John Smith",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    {
      id: "user-2",
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      initials: "AJ",
    },
  ]

  const projects = [
    { id: "project-1", name: "Website Redesign" },
    { id: "project-2", name: "Mobile App" },
    { id: "project-3", name: "API Development" },
  ]

  const days: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"> = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]

  const sampleIssues: HourlyIssue[] = []

  // Generate 20 sample issues
  for (let i = 0; i < 20; i++) {
    const user = users[i % users.length]
    const project = projects[i % projects.length]
    const day = days[i % days.length]
    const hour = 9 + (i % 8) // 9 AM to 5 PM

    const issue: HourlyIssue = {
      id: `hourly-issue-${i + 1}`,
      title: `Task ${i + 1}: ${project.name} work`,
      description: `Working on ${project.name} for ${hour}:00`,
      projectId: project.id,
      projectName: project.name,
      hour,
      day,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userInitials: user.initials,
      color: getColorForProject(project.id),
      createdAt: new Date().toISOString(),
      completed: Math.random() > 0.7, // 30% chance of being completed
    }

    sampleIssues.push(issue)
  }

  return sampleIssues
}

const initialState: WeeklyBoardState = {
  hourlyIssues: generateSampleHourlyIssues(),
  selectedWeek: getCurrentWeekMonday(),
}

export const weeklyBoardSlice = createSlice({
  name: "weeklyBoard",
  initialState,
  reducers: {
    addHourlyIssue: (state, action: PayloadAction<Omit<HourlyIssue, "id" | "createdAt" | "color">>) => {
      const newIssue: HourlyIssue = {
        ...action.payload,
        id: `hourly-issue-${Date.now()}`,
        createdAt: new Date().toISOString(),
        color: getColorForProject(action.payload.projectId),
      }
      state.hourlyIssues.push(newIssue)
    },
    updateHourlyIssue: (state, action: PayloadAction<{ id: string; changes: Partial<HourlyIssue> }>) => {
      const issue = state.hourlyIssues.find((issue) => issue.id === action.payload.id)
      if (issue) {
        Object.assign(issue, action.payload.changes)

        // Update color if project changed
        if (action.payload.changes.projectId) {
          issue.color = getColorForProject(action.payload.changes.projectId)
        }
      }
    },
    removeHourlyIssue: (state, action: PayloadAction<string>) => {
      state.hourlyIssues = state.hourlyIssues.filter((issue) => issue.id !== action.payload)
    },
    moveHourlyIssue: (state, action: PayloadAction<{ id: string; newDay: HourlyIssue["day"]; newHour?: number }>) => {
      const { id, newDay, newHour } = action.payload
      const issue = state.hourlyIssues.find((issue) => issue.id === id)
      if (issue) {
        issue.day = newDay
        if (newHour !== undefined) {
          issue.hour = newHour
        }
      }
    },
    toggleIssueCompletion: (state, action: PayloadAction<string>) => {
      const issue = state.hourlyIssues.find((issue) => issue.id === action.payload)
      if (issue) {
        issue.completed = !issue.completed
      }
    },
    setSelectedWeek: (state, action: PayloadAction<string>) => {
      state.selectedWeek = action.payload
    },
  },
})

export const {
  addHourlyIssue,
  updateHourlyIssue,
  removeHourlyIssue,
  moveHourlyIssue,
  toggleIssueCompletion,
  setSelectedWeek,
} = weeklyBoardSlice.actions
export default weeklyBoardSlice.reducer
