

export const BASE_AUTH = "/api/auth/"
export const REGISTER = BASE_AUTH + "register"
export const REGISTER_WITH_TOKEN = BASE_AUTH + "register-by-invitation"
export const VALIDATE_INVITATION_TOKEN = BASE_AUTH + "validate-invitation-token"




// projects
export const BASE_PATH_V2 = "/api/v2/";
export const PROJECT_URL = BASE_PATH_V2 + "projects";
export const PROJECT_USER_ROLES_URL = BASE_PATH_V2 + "project-user-roles";
export const PROJECT_TASK_STATUS_URL = BASE_PATH_V2 + "project-task-status";
export const PERMISSIONS = BASE_PATH_V2 + "permissions";



// project-team
export const PROJECT_TEAM_URL = BASE_PATH_V2 + "project-team";
export const TEAM_DETAIL_URL = PROJECT_TEAM_URL + "/get-team-detail";
export const TEAM_ALL_URL = PROJECT_TEAM_URL + "/all";


// project-users
export const PROJECT_USERS = BASE_PATH_V2 + "project-users";
export const GET_ACTIVE_PROJECT_USERS = PROJECT_USERS + "/get-active-users/project";
export const GET_ALL_PROJECT_USERS = PROJECT_USERS + "/all-users/project";
export const REMOVE_PROJECT_USERS_URL = PROJECT_USERS + "/remove-user";





// project-team-user
export const TEAM_USER_URL = BASE_PATH_V2 + "/project-team-user";
export const TEAM_USER_NOT_IN_URL = TEAM_USER_URL + "/not-in-team"
export const TEAM_USER_IN_URL = TEAM_USER_URL + "/in-team"
export const TEAM_USER_REMOVE_URL = TEAM_USER_URL + "/remove"





// invitation/project
export const INVITATION_PROJECT = BASE_PATH_V2 + "invitation/project";
export const INVITATION_ACCEPT = INVITATION_PROJECT + "/accept";
export const INVITATION_DECLINE = INVITATION_PROJECT + "/decline";

export const INVITE_TO_PROJECT = INVITATION_PROJECT + "/invite-to-project";
export const INVITATION_BY_PENDING = INVITATION_PROJECT + "/pending";
export const INVITATION_BY_PROJECTID = INVITATION_PROJECT + "/all-by-projectId";



export const BACKLOG_URL = BASE_PATH_V2 + "backlog";



export const KANBAN_URL = BASE_PATH_V2 + "kanban";




// sprint
export const SPRINT_URL = BASE_PATH_V2 + "sprint";
export const SPRINT_GET_ALL_URL = SPRINT_URL + "/getAll";
export const SPRINT_NON_COMPLETED_GET_ALL_URL = SPRINT_URL + "/non-completed/project";
export const UPDATE_STATUS_URL = SPRINT_URL + "/status";
export const SPRINT_STATUS_COMPLETE_URL = SPRINT_URL + "/status/complete";




// sprint user
export const SPRINT_USER_URL = BASE_PATH_V2 + "sprint-user";
export const SPRINT_GET_ALL_USER_URL = SPRINT_USER_URL + "/users";
export const SPRINT_BULK_ADD_URL = SPRINT_USER_URL + "/bulk-add";
export const SPRINT_BULK_REMOVE_URL = SPRINT_USER_URL + "/bulk-remove";

// sprint-task
export const SPRINT_TASK_URL = BASE_PATH_V2 + "sprint-task";
export const SPRINT_TASK_ADD_URL = SPRINT_TASK_URL + "/add";
export const SPRINT_TASK_REMOVE_URL = SPRINT_TASK_URL + "/remove";
export const SPRINT_TASK_GET_ALL_URL = SPRINT_TASK_URL + "/get-all";


// user
export const USER_URL = BASE_PATH_V2 + "user"
export const USER_UPDATE_ME_URL = USER_URL + "/me";
export const USER_UPDATE_ME_PASSWORD_URL = USER_UPDATE_ME_URL + "/password";


// public password-reset
export const PASSWORD_RESET_PUBLIC_URL = BASE_PATH_V2 + "public/password-reset";
export const PASSWORD_RESET_PUBLIC_VALIDATE_TOKEN_URL = PASSWORD_RESET_PUBLIC_URL + "/validate-reset-token";
export const FORGOT_PASSWORD_URL = PASSWORD_RESET_PUBLIC_URL + "/forgot-password";
export const PASSWORD_RESET_URL = PASSWORD_RESET_PUBLIC_URL + "/reset-password";



// EMAİL CHANGE
export const EMAIL_CHANGE_URL = BASE_PATH_V2 + "email-change";
export const SEND_CODE_URL = EMAIL_CHANGE_URL + "/send-code";
export const VERIFY_AND_SEND_LINK_URL = EMAIL_CHANGE_URL + "/verify-and-send-link";

//  public email-change
export const EMAIL_CHANGE_PUBLIC_URL = BASE_PATH_V2 + "public/email-change";
export const EMAIL_CHANGE_PUBLIC_CONFIRM_URL = EMAIL_CHANGE_PUBLIC_URL + "/confirm";
export const EMAIL_CHANGE_PUBLIC_REJECT_URL = EMAIL_CHANGE_PUBLIC_URL + "/reject";
export const EMAIL_CHANGE_PUBLIC_VALIDATE_TOKEN_URL = EMAIL_CHANGE_PUBLIC_URL + "/validate-token";


// project-task"
export const PROJECT_TASK = BASE_PATH_V2 + "project-task"
export const UPDATE_PROJECT_TASK_STATUS_URL = PROJECT_TASK + "/update-status";
export const PROJECT_TASK_SUBTASKS = PROJECT_TASK + "/subtasks";


export const PROJECT_TASK_COMMENT = BASE_PATH_V2 + "project-task-comment"
export const PROJECT_TASK_COMMENT_ADD_URL = PROJECT_TASK_COMMENT + "/add";

