

export interface Links {
    home: string;
    dashboard: string;
    login: string;
    logout: string;
    register: string;
    registerInviteToken: (token: string) => string;
    profile: string;
    notifications: string;
    users: string;
    tasks: string;
    newTask: string;
    editTask: (taskId: string) => string;
    taskDetail: (taskId: string) => string;
    projects: string;
    projectDetail: (id: string) => string;
    projectStatusManagement: (id: string) => string;
    sprints: string;
    backlog: string;
    kanban: string;
    companies: string;
    companyDetail: (id: string) => string;
    myCompany: string;
    teams: string;
    projectTeamDetail: (projectId: string, teamId: string) => string;
    companyTeamDetail: (companyId: string, teamId: string) => string;
    weeklyBoard: string;
    requestLeave: string;
    requestOvertime: string;
    requestSpending: string;
    approveLeave: string;
    approveOvertime: string;
    approveSpending: string;
    reports: string;
}

export const links: Links = {
    home: "/",
    dashboard: "/dashboard",
    login: "/",
    logout: "/logout",
    register: "/register",
    registerInviteToken: (token: string) => `/register/invite/${token}`,
    profile: "/profile",
    notifications: "/notifications",
    users: "/users",
    tasks: "/tasks",
    newTask: "/tasks/new",
    taskDetail: (taskId: string) => `/tasks/${taskId}`,
    editTask: (taskId: string) => `/tasks/${taskId}/edit`,
    projects: "/projects",
    projectDetail: (id: string) => `/projects/${id}`,
    projectStatusManagement: (id: string) => `/projects/${id}/status-management`,
    sprints: "/sprints",
    backlog: "/backlog",
    kanban: "/kanban",
    companies: "/companies",
    companyDetail: (id: string) => `/companies/${id}`,
    myCompany: "/my-company",
    teams: "/teams/project-teams",
    projectTeamDetail: (projectId: string, teamId: string) =>
        `/teams/${projectId}/${teamId}`,
    companyTeamDetail: (companyId: string, teamId: string) =>
        `/teams/company-teams/${companyId}/${teamId}`,
    weeklyBoard: "/weekly-board",
    requestLeave: "/request/leave",
    requestOvertime: "/request/overtime",
    requestSpending: "/request/spending",
    approveLeave: "/request-approvals/leave",
    approveOvertime: "/request-approvals/overtime",
    approveSpending: "/request-approvals/spending",
    reports: "/reports",
};



export interface SidebarLink {
    href: string;
    label: string;
    icon: string;
    loginRequired: boolean;
    activeKey: string;
}

export const sidebarLinks: SidebarLink[] = [
    {
        href: links.dashboard,
        label: "Home",
        icon: "Home",
        loginRequired: false,
        activeKey: "home",
    },
    {
        href: links.profile,
        label: "Profile",
        icon: "Profile",
        loginRequired: true,
        activeKey: "profile",
    },
    {
        href: links.users,
        label: "Users",
        icon: "Users",
        loginRequired: true,
        activeKey: "users",
    },
    {
        href: links.projects,
        label: "Projects",
        icon: "Projects",
        loginRequired: true,
        activeKey: "projects",
    },
    {
        href: links.tasks,
        label: "Tasks",
        icon: "Tasks",
        loginRequired: true,
        activeKey: "tasks",
    },
    {
        href: links.sprints,
        label: "Sprints",
        icon: "Sprints",
        loginRequired: true,
        activeKey: "sprints",
    },
    {
        href: links.backlog,
        label: "Backlog",
        icon: "Backlog",
        loginRequired: true,
        activeKey: "backlog",
    },
    {
        href: links.board,
        label: "Board",
        icon: "Board",
        loginRequired: true,
        activeKey: "Bboard",
    },
];