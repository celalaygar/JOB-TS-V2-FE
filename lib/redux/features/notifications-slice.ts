import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Notification {
  id: string
  type: "comment" | "mention" | "status" | "assignment" | "due_date"
  title: string
  message: string
  issueId: string
  issueTitle: string
  sender: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  date: string
  read: boolean
}

interface NotificationsState {
  notifications: Notification[]
}

// Generate sample notifications
const generateSampleNotifications = (): Notification[] => {
  const now = new Date()
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
    {
      id: "user-3",
      name: "Sarah Miller",
      avatar: "/placeholder.svg",
      initials: "SM",
    },
    {
      id: "user-4",
      name: "David Chen",
      avatar: "/placeholder.svg",
      initials: "DC",
    },
  ]

  const issues = [
    { id: "issue-1", title: "Fix login page validation" },
    { id: "issue-2", title: "Implement dark mode toggle" },
    { id: "issue-3", title: "API endpoint for user profile" },
    { id: "issue-4", title: "Optimize image loading" },
    { id: "issue-5", title: "Fix checkout process bug" },
  ]

  const notifications: Notification[] = [
    {
      id: "notification-1",
      type: "comment",
      title: "New comment on your issue",
      message:
        "I've identified the root cause of this bug. It's related to the validation logic in the form component.",
      issueId: issues[0].id,
      issueTitle: issues[0].title,
      sender: users[1],
      date: new Date(now.getTime() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      read: false,
    },
    {
      id: "notification-2",
      type: "mention",
      title: "You were mentioned in a comment",
      message: "@John Smith can you review this PR when you have a chance? I've implemented the changes we discussed.",
      issueId: issues[1].id,
      issueTitle: issues[1].title,
      sender: users[2],
      date: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
    },
    {
      id: "notification-3",
      type: "status",
      title: "Issue status changed",
      message: "The issue status has been changed from 'In Progress' to 'In Review'",
      issueId: issues[2].id,
      issueTitle: issues[2].title,
      sender: users[3],
      date: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      read: true,
    },
    {
      id: "notification-4",
      type: "assignment",
      title: "Issue assigned to you",
      message:
        "You have been assigned to work on this issue. Please review and update the status when you start working on it.",
      issueId: issues[3].id,
      issueTitle: issues[3].title,
      sender: users[0],
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
    },
    {
      id: "notification-5",
      type: "mention",
      title: "You were mentioned in a comment",
      message:
        "I think @John Smith and @Sarah Miller should collaborate on this feature since it spans both frontend and backend.",
      issueId: issues[4].id,
      issueTitle: issues[4].title,
      sender: users[3],
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      read: false,
    },
    {
      id: "notification-6",
      type: "status",
      title: "Issue completed",
      message: "The issue status has been changed from 'In Review' to 'Done'",
      issueId: issues[1].id,
      issueTitle: issues[1].title,
      sender: users[2],
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      read: true,
    },
    {
      id: "notification-7",
      type: "due_date",
      title: "Issue due date approaching",
      message: "This issue is due in 2 days. Please update the status or request an extension if needed.",
      issueId: issues[4].id,
      issueTitle: issues[4].title,
      sender: users[0],
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
      read: true,
    },
    {
      id: "notification-8",
      type: "comment",
      title: "New comment on your issue",
      message: "I've pushed a fix for this issue. Can you please test it on your end?",
      issueId: issues[3].id,
      issueTitle: issues[3].title,
      sender: users[1],
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      read: true,
    },
  ]

  return notifications
}

const initialState: NotificationsState = {
  notifications: generateSampleNotifications(),
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    deleteAllRead: (state) => {
      state.notifications = state.notifications.filter((n) => !n.read)
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead, deleteNotification, deleteAllRead } =
  notificationsSlice.actions
export default notificationsSlice.reducer
