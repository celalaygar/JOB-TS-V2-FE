import { configureStore } from "@reduxjs/toolkit"
import projectsReducer from "./features/projects-slice"
import issuesReducer from "./features/issues-slice"
import sprintsReducer from "./features/sprints-slice"
import filtersReducer from "./features/filters-slice"
import tasksReducer from "./features/tasks-slice"
import notificationsReducer from "./features/notifications-slice"
import weeklyBoardReducer from "./features/weekly-board-slice"
import authReducer from "./features/auth-slice"
import usersReducer from "./features/users-slice"
import companiesReducer from "./features/companies-slice"
import invitationsReducer from "./features/invitations-slice"
import projectRolesReducer from "./features/project-roles-slice"
import companyRolesReducer from "./features/company-roles-slice"
// Note: There's no teamsReducer in the store configuration

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    issues: issuesReducer,
    sprints: sprintsReducer,
    filters: filtersReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
    weeklyBoard: weeklyBoardReducer,
    auth: authReducer,
    users: usersReducer,
    companies: companiesReducer,
    invitations: invitationsReducer,
    projectRoles: projectRolesReducer,
    companyRoles: companyRolesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
