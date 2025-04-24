import { configureStore } from "@reduxjs/toolkit"
import tasksReducer from "./features/tasks-slice"
import projectsReducer from "./features/projects-slice"
import usersReducer from "./features/users-slice"
import sprintsReducer from "./features/sprints-slice"
import filtersReducer from "./features/filters-slice"
import notificationsReducer from "./features/notifications-slice"
import weeklyBoardReducer from "./features/weekly-board-slice"
import authReducer from "./features/auth-slice"
import invitationsReducer from "./features/invitations-slice"
import issuesReducer from "./features/issues-slice"
import companiesReducer from "./features/companies-slice"
import projectRolesReducer from "./features/project-roles-slice"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    projects: projectsReducer,
    users: usersReducer,
    sprints: sprintsReducer,
    filters: filtersReducer,
    notifications: notificationsReducer,
    weeklyBoard: weeklyBoardReducer,
    auth: authReducer,
    invitations: invitationsReducer,
    issues: issuesReducer,
    companies: companiesReducer,
    projectRoles: projectRolesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
