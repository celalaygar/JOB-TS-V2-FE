

export const BASE_AUTH = "/api/auth/"
export const REGISTER = BASE_AUTH + "register"
export const REGISTER_WITH_TOKEN = BASE_AUTH + "register-by-invitation"


export const BASE_PATH_V2 = "/api/v2/";
export const PROJECT_URL = BASE_PATH_V2 + "projects";
export const PROJECT_USER_ROLES_URL = BASE_PATH_V2 + "project-user-roles";
export const PROJECT_TASK_STATUS_URL = BASE_PATH_V2 + "project-task-status";
export const PERMISSIONS = BASE_PATH_V2 + "permissions";

export const PROJECT_TEAM_URL = BASE_PATH_V2 + "project-team";
export const TEAM_DETAIL_URL = PROJECT_TEAM_URL + "/get-team-detail";
export const TEAM_ALL_URL = PROJECT_TEAM_URL + "/all";


export const TEAM_USER_URL = BASE_PATH_V2 + "/project-team-user";
export const TEAM_USER_NOT_IN_URL = TEAM_USER_URL + "/not-in-team"
export const TEAM_USER_IN_URL = TEAM_USER_URL + "/in-team"
export const TEAM_USER_REMOVE_URL = TEAM_USER_URL + "/remove"


export const INVITATION_PROJECT = BASE_PATH_V2 + "invitation/project";
export const INVITATION_ACCEPT = INVITATION_PROJECT + "/accept";
export const INVITATION_DECLINE = INVITATION_PROJECT + "/decline";

export const INVITE_TO_PROJECT = INVITATION_PROJECT + "/invite-to-project";
export const INVITATION_BY_PENDING = INVITATION_PROJECT + "/pending";
export const INVITATION_BY_PROJECTID = INVITATION_PROJECT + "/all-by-projectId";



export const BACKLOG_URL = BASE_PATH_V2 + "backlog";

export const KANBAN_URL = BASE_PATH_V2 + "kanban";



export const SPRINT_URL = BASE_PATH_V2 + "sprint";
export const SPRINT_GET_ALL_URL = SPRINT_URL + "/getAll";
export const SPRINT_NON_COMPLETED_GET_ALL_URL = SPRINT_URL + "/non-completed/project";


export const SPRINT_TASK_URL = BASE_PATH_V2 + "sprint-task";
export const SPRINT_TASK_ADD_URL = SPRINT_TASK_URL + "/add";
export const SPRINT_TASK_REMOVE_URL = SPRINT_TASK_URL + "/remove";

export const PROJECT_USERS = BASE_PATH_V2 + "project-users";
export const GET_PROJECT_USERS = PROJECT_USERS + "/get-users/project";
export const REMOVE_PROJECT_USERS_URL = PROJECT_USERS + "/remove-user";





export const PROJECT_TASK = BASE_PATH_V2 + "project-task"
export const UPDATE_PROJECT_TASK_STATUS_URL = PROJECT_TASK + "/update-status";


export const PROJECT_TASK_SUBTASKS = PROJECT_TASK + "/subtasks";

