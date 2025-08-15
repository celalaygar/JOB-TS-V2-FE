// src/lib/service/api-helpers.ts

import BaseService from "@/lib/service/BaseService";
import { httpMethods } from "@/lib/service/HttpService";
import { toast } from "@/hooks/use-toast";
import type { ProjectUser, RemoveProjectUserRequest } from "@/types/project";
import type { AddUserToSprintRequest, RemoveUserFromSprintRequest, Sprint, SprintRequest, SprintTaskAddRequest, SprintTaskGetAllRequest, SprintTaskRemoveRequest, SprintUser, UpdateSprintStatusRequest } from "@/types/sprint";
import type { ProjectTeam, Project, ProjectTaskStatus } from "@/types/project";
import type { ProjectRole, ProjectRolePermission, ProjectRoleRequest } from "@/types/project-role";
import type { Invitation } from "@/lib/redux/features/invitations-slice";
import {
  GET_ACTIVE_PROJECT_USERS,
  GET_ALL_PROJECT_USERS,
  REMOVE_PROJECT_USERS_URL,
  SPRINT_NON_COMPLETED_GET_ALL_URL,
  PROJECT_TEAM_URL,
  TEAM_ALL_URL,
  PROJECT_URL,
  SPRINT_GET_ALL_URL,
  UPDATE_STATUS_URL,
  PROJECT_USER_ROLES_URL,
  PERMISSIONS,
  PROJECT_TASK_STATUS_URL,
  UPDATE_PROJECT_TASK_STATUS_URL,
  INVITATION_BY_PROJECTID,
  INVITE_TO_PROJECT,
  SPRINT_TASK_URL,
  SPRINT_USER_URL,
  SPRINT_TASK_ADD_URL,
  SPRINT_TASK_REMOVE_URL,
  BACKLOG_URL,
  SPRINT_URL, // Import SPRINT_URL
  TEAM_DETAIL_URL,
  PROJECT_TASK,
  PROJECT_TASK_SUBTASKS,
  INVITATION_BY_PENDING,
  INVITATION_PROJECT,
  INVITATION_ACCEPT,
  INVITATION_DECLINE,
  TEAM_USER_URL,
  TEAM_USER_REMOVE_URL,
  TEAM_USER_NOT_IN_URL,
  TEAM_USER_IN_URL,
  KANBAN_URL,
  SPRINT_TASK_GET_ALL_URL,
  SPRINT_GET_ALL_USER_URL,
  SPRINT_BULK_ADD_URL,
  SPRINT_BULK_REMOVE_URL
} from "@/lib/service/BasePath";
import { ProjectTask, ProjectTaskFilterRequest, TaskResponse, TaskUpdateRequest } from "@/types/task";
import { BacklogFilterRequest } from "@/types/backlog";
import { ProjectTaskStatusRequest } from "@/types/project-task-status";

interface ApiOperationConfig<T> {
  url: string;
  method: keyof typeof httpMethods;
  body?: any;
  setLoading: (loading: boolean) => void;
  successMessage?: string;
  errorMessagePrefix?: string;
  successToastTitle?: string;
  errorToastTitle?: string;
}

export async function apiCall<T>(config: ApiOperationConfig<T>): Promise<T | null> {
  const {
    url,
    method,
    body,
    setLoading,
    successMessage,
    errorMessagePrefix = "Operation failed",
    successToastTitle,
    errorToastTitle,
  } = config;

  setLoading(true);

  try {
    // console.log("url : " + url)
    // console.log("method : " + method)
    // console.log("body : ")
    // console.log(body)
    const response: T = await BaseService.request(url, { method, body });

    // if (successMessage) {
    //   toast({
    //     title: successToastTitle || "Success",
    //     description: successMessage,
    //     variant: "default",
    //     duration: 20000, // 2 seconds
    //   });
    // }

    return response;
  } catch (error: any) {
    console.error(`${errorMessagePrefix}:`, error);

    const errorMessage = error.message || "An unexpected error occurred.";

    let displayErrorTitle = errorToastTitle || errorMessagePrefix;
    let displayErrorDescription = errorMessage;

    if (error.status === 400) {
      displayErrorTitle = "Bad Request (400)";
      displayErrorDescription = error.message || "Bad Request";
    } else if (error.status === 500) {
      displayErrorTitle = "Server Error (500)";
      displayErrorDescription = "There was a server error. Please try again later.";
    }

    toast({
      title: displayErrorTitle + " " + url,
      description: displayErrorDescription,
      variant: "destructive",
      duration: 20000, // 2 seconds
    });

    return null;
  } finally {
    setLoading(false);
  }
}

interface FetchEntitiesOptions {
  setLoading: (loading: boolean) => void;
}

// Interface for inviting users, copied from the component
interface InviteUserRequest {
  projectId: string;
  email: string;
  userProjectRole: string;
}


export const removeProjectUserHelper = async (body: RemoveProjectUserRequest, options: FetchEntitiesOptions): Promise<ProjectUser | null> => {
  return apiCall<ProjectUser>({
    url: REMOVE_PROJECT_USERS_URL,
    method: httpMethods.POST,
    body,
    setLoading: options.setLoading,
    successMessage: "Project user has been successfully removed.",
    errorMessagePrefix: "Failed to remove project user",
    successToastTitle: "Project User Removed",
    errorToastTitle: "Error Removing Project User",
  });
}


export const getActiveProjectUsersHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<ProjectUser[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<ProjectUser[]>({
    url: `${GET_ACTIVE_PROJECT_USERS}/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Active Users for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load project Active users",
    successToastTitle: "Project Active Users Loaded",
    errorToastTitle: "Error Loading Project Active Users",
  });
};

export const getAllProjectUsersHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<ProjectUser[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<ProjectUser[]>({
    url: `${GET_ALL_PROJECT_USERS}/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `All Users for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load project All users",
    successToastTitle: "Project All Users Loaded",
    errorToastTitle: "Error Loading Project All Users",
  });
};




export const getSprintsHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<Sprint[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<Sprint[]>({
    url: `${SPRINT_NON_COMPLETED_GET_ALL_URL}/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Sprints for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load sprints",
    successToastTitle: "Sprints Loaded",
    errorToastTitle: "Error Loading Sprints",
  });
};

export const getAllProjectTeamsByProjectIdHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<ProjectTeam[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<ProjectTeam[]>({
    url: `${PROJECT_TEAM_URL}/project/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Teams for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load project teams",
    successToastTitle: "Project Teams Loaded",
    errorToastTitle: "Error Loading Project Teams",
  });
};


export const getAllProjectTeamsHelper = async (options: FetchEntitiesOptions): Promise<ProjectTeam[] | null> => {
  return apiCall<ProjectTeam[]>({
    url: TEAM_ALL_URL,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: "All project teams have been retrieved.",
    errorMessagePrefix: "Failed to load all project teams",
    successToastTitle: "All Project Teams Loaded",
    errorToastTitle: "Error Loading All Project Teams",
  });
};


export const getAllProjectsHelper = async (options: FetchEntitiesOptions): Promise<Project[] | null> => {
  return apiCall<Project[]>({
    url: PROJECT_URL,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: "All projects have been retrieved.",
    errorMessagePrefix: "Failed to load projects",
    successToastTitle: "Projects Loaded",
    errorToastTitle: "Error Loading Projects",
  });
};

export const getAllSprintsGlobalHelper = async (options: FetchEntitiesOptions): Promise<Sprint[] | null> => {
  return apiCall<Sprint[]>({
    url: SPRINT_GET_ALL_URL,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: "All sprints have been retrieved.",
    errorMessagePrefix: "Failed to load all sprints",
    successToastTitle: "All Sprints Loaded",
    errorToastTitle: "Error Loading All Sprints",
  });
};
export const getAllSprintUsersHelper = async (body: SprintRequest, options: FetchEntitiesOptions): Promise<SprintUser[] | null> => {
  return apiCall<SprintUser[]>({
    url: `${SPRINT_GET_ALL_USER_URL}`,
    method: httpMethods.POST,
    body: body,
    setLoading: options.setLoading,
    successMessage: "All sprint Users have been retrieved.",
    errorMessagePrefix: "Failed to load all sprint Users",
    successToastTitle: "All Sprint Users Loaded",
    errorToastTitle: "Error Loading All Sprint Users",
  });
};

export const addBulkUserToSprintHelper = async (body: AddUserToSprintRequest, options: FetchEntitiesOptions): Promise<SprintUser[] | null> => {
  return apiCall<SprintUser[]>({
    url: `${SPRINT_BULK_ADD_URL}`,
    method: httpMethods.POST,
    body: body,
    setLoading: options.setLoading,
    successMessage: "All sprint Bulk Users have been added.",
    errorMessagePrefix: "Failed to add all sprint Bulk Users",
    successToastTitle: "All Sprint Bulk Users added",
    errorToastTitle: "Error adding All Sprint Bulk Users",
  });
};

export const removeBulkUserFromSprintHelper = async (body: RemoveUserFromSprintRequest, options: FetchEntitiesOptions): Promise<SprintUser[] | null> => {
  return apiCall<SprintUser[]>({
    url: `${SPRINT_BULK_REMOVE_URL}`,
    method: httpMethods.POST,
    body: body,
    setLoading: options.setLoading,
    successMessage: "All sprint Bulk Users have been removed.",
    errorMessagePrefix: "Failed to remove all sprint Bulk Users",
    successToastTitle: "All Sprint Bulk Users removed",
    errorToastTitle: "Error removing All Sprint Bulk Users",
  });
};




export const updateSprintStatustHelper = async (body: UpdateSprintStatusRequest, options: FetchEntitiesOptions): Promise<Sprint | null> => {
  return apiCall<Sprint>({
    url: UPDATE_STATUS_URL,
    method: httpMethods.POST,
    body: body,
    setLoading: options.setLoading,
    successMessage: "Sprint Status has been successfully updated.",
    errorMessagePrefix: "Failed to updated Sprint Status",
    successToastTitle: "Sprint Status updated",
    errorToastTitle: "Error updating Sprint Status",
  });
};



export const createProjectHelper = async (projectData: any, options: FetchEntitiesOptions): Promise<Project | null> => {
  return apiCall<Project>({
    url: PROJECT_URL,
    method: httpMethods.POST,
    body: projectData,
    setLoading: options.setLoading,
    successMessage: "Project has been successfully created.",
    errorMessagePrefix: "Failed to create project",
    successToastTitle: "Project Created",
    errorToastTitle: "Error Creating Project",
  });
};
export const updateProjectHelper = async (projectId: string, projectData: any, options: FetchEntitiesOptions): Promise<Project | null> => {
  return apiCall<Project>({
    url: `${PROJECT_URL}/${projectId}`,
    method: httpMethods.PUT,
    body: projectData,
    setLoading: options.setLoading,
    successMessage: "Project has been successfully updated.",
    errorMessagePrefix: "Failed to update project",
    successToastTitle: "Project Updated",
    errorToastTitle: "Error Updating Project",
  });
}



export const getAllProjectsRolesHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<ProjectRole[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<ProjectRole[]>({
    url: `${PROJECT_USER_ROLES_URL}/project/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Roles for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load project roles",
    successToastTitle: "Project Roles Loaded",
    errorToastTitle: "Error Loading Project Roles",
  });
};

export const getAllProjectsRolePermissionsHelper = async (options: FetchEntitiesOptions): Promise<ProjectRolePermission[] | null> => {
  return apiCall<ProjectRolePermission[]>({
    url: PERMISSIONS,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: "All role permissions have been retrieved.",
    errorMessagePrefix: "Failed to load role permissions",
    successToastTitle: "Role Permissions Loaded",
    errorToastTitle: "Error Loading Role Permissions",
  });
};

export const updateProjectUserRoleHelper = async (roleId: string, roleData: ProjectRoleRequest, options: FetchEntitiesOptions): Promise<ProjectRole | null> => {
  return apiCall<ProjectRole>({
    url: `${PROJECT_USER_ROLES_URL}/${roleId}`,
    method: httpMethods.PUT,
    body: roleData,
    setLoading: options.setLoading,
    successMessage: `Project user role "${roleData.name}" has been updated.`,
    errorMessagePrefix: "Failed to update project user role",
    successToastTitle: "Project Role Updated",
    errorToastTitle: "Error Updating Project Role",
  });
};

export const createProjectUserRoleHelper = async (newRoleData: ProjectRoleRequest, options: FetchEntitiesOptions): Promise<ProjectRole | null> => {
  return apiCall<ProjectRole>({
    url: PROJECT_USER_ROLES_URL,
    method: httpMethods.POST,
    body: newRoleData,
    setLoading: options.setLoading,
    successMessage: `Project user role "${newRoleData.name}" has been created.`,
    errorMessagePrefix: "Failed to create project user role",
    successToastTitle: "Project Role Created",
    errorToastTitle: "Error Creating Project Role",
  });
};

export const getAllProjectTaskStatusHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<ProjectTaskStatus[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<ProjectTaskStatus[]>({
    url: `${PROJECT_TASK_STATUS_URL}/project/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Task statuses for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load project task statuses",
    successToastTitle: "Project Task Statuses Loaded",
    errorToastTitle: "Error Loading Project Task Statuses",
  });
};

export const updateProjectTaskStatusHelper = async (request: ProjectTaskStatusRequest, options: FetchEntitiesOptions): Promise<ProjectTask | null> => {
  return apiCall<ProjectTask>({
    url: UPDATE_PROJECT_TASK_STATUS_URL,
    method: httpMethods.POST,
    body: request,
    setLoading: options.setLoading,
    successMessage: `Project task status "${request.projectTaskName}" has been updated.`,
    errorMessagePrefix: "Failed to update project task status",
    successToastTitle: "Project Task Status Updated",
    errorToastTitle: "Error Updating Project Task Status",
  });
}

export const saveTaskStatusHelper = async (statusData: ProjectTaskStatus, options: FetchEntitiesOptions): Promise<ProjectTaskStatus | null> => {
  const method = statusData.id ? httpMethods.PUT : httpMethods.POST;
  const url = statusData.id ? `${PROJECT_TASK_STATUS_URL}/${statusData.id}` : PROJECT_TASK_STATUS_URL;
  const successMsg = statusData.id ? `Project task status "${statusData.name}" updated.` : `Project task status "${statusData.name}" created.`;
  const errorPrefix = statusData.id ? "Failed to update project task status" : "Failed to create project task status";
  const successToast = statusData.id ? "Project Task Status Updated" : "Project Task Status Created";
  const errorToast = statusData.id ? "Error Updating Project Task Status" : "Error Creating Project Task Status";

  return apiCall<ProjectTaskStatus>({
    url,
    method,
    body: statusData,
    setLoading: options.setLoading,
    successMessage: successMsg,
    errorMessagePrefix: errorPrefix,
    successToastTitle: successToast,
    errorToastTitle: errorToast,
  });
};

export const getAllInvitationsHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<Invitation[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<Invitation[]>({
    url: INVITATION_BY_PROJECTID,
    method: httpMethods.POST, // Assuming it's a POST request with projectId in the body
    body: { projectId },
    setLoading: options.setLoading,
    successMessage: `Invitations for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load invitations",
    successToastTitle: "Invitations Loaded",
    errorToastTitle: "Error Loading Invitations",
  });
};

export const createUpdateProjectTeamHelper = async (teamData: ProjectTeam, isEditMode: boolean, options: FetchEntitiesOptions): Promise<ProjectTeam | null> => {
  const method = isEditMode ? httpMethods.PUT : httpMethods.POST;
  const url = PROJECT_TEAM_URL; // The URL for both POST and PUT for teams

  const successMessage = isEditMode
    ? `Project Team "${teamData.name}" updated.`
    : `Project Team "${teamData.name}" created.`;

  const errorMessagePrefix = isEditMode
    ? "Failed to update project team"
    : "Failed to create project team";

  const successToastTitle = isEditMode
    ? "Project Team Updated"
    : "Project Team Created";

  const errorToastTitle = isEditMode
    ? "Error Updating Project Team"
    : "Error Creating Project Team";

  return apiCall<ProjectTeam>({
    url,
    method,
    body: teamData,
    setLoading: options.setLoading,
    successMessage,
    errorMessagePrefix,
    successToastTitle,
    errorToastTitle,
  });
};

export const inviteUserToProjectHelper = async (inviteData: InviteUserRequest, options: FetchEntitiesOptions): Promise<InviteUserRequest | null> => {
  return apiCall<InviteUserRequest>({
    url: INVITE_TO_PROJECT,
    method: httpMethods.POST,
    body: inviteData,
    setLoading: options.setLoading,
    successMessage: `${inviteData.email} has been invited to the project.`,
    errorMessagePrefix: "Failed to invite user",
    successToastTitle: "User Invited",
    errorToastTitle: "Error Inviting User",
  });
};

export const saveSprintHelper = async (sprintData: Sprint, options: FetchEntitiesOptions): Promise<Sprint | null> => {
  return apiCall<Sprint>({
    url: SPRINT_URL,
    method: httpMethods.POST, // Assuming it's always POST for creating new sprints
    body: sprintData,
    setLoading: options.setLoading,
    successMessage: `Sprint "${sprintData.name}" has been successfully saved.`,
    errorMessagePrefix: "Failed to save sprint",
    successToastTitle: "Sprint Saved",
    errorToastTitle: "Error Saving Sprint",
  });
};


export const saveUpdateSprintHelper = async (sprintData: Sprint, options: FetchEntitiesOptions): Promise<Sprint | null> => {
  const method = sprintData.id ? httpMethods.PUT : httpMethods.POST;
  const url = sprintData.id ? `${SPRINT_URL}/${sprintData.id}` : SPRINT_URL; // Adjust URL for PUT if ID is in path

  const successMessage = sprintData.id
    ? `Sprint "${sprintData.name}" has been successfully updated.`
    : `Sprint "${sprintData.name}" has been successfully created.`;

  const errorMessagePrefix = sprintData.id
    ? "Failed to update sprint"
    : "Failed to create sprint";

  const successToastTitle = sprintData.id
    ? "Sprint Updated"
    : "Sprint Created";

  const errorToastTitle = sprintData.id
    ? "Error Updating Sprint"
    : "Error Creating Sprint";

  return apiCall<Sprint>({
    url,
    method,
    body: sprintData,
    setLoading: options.setLoading,
    successMessage,
    errorMessagePrefix,
    successToastTitle,
    errorToastTitle,
  });
};

export const getSprintHelper = async (sprintId: string, options: FetchEntitiesOptions): Promise<Sprint | null> => {
  if (!sprintId) {
    options.setLoading(false);
    return null;
  }

  return apiCall<Sprint>({
    url: `${SPRINT_URL}/${sprintId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Sprint ${sprintId} details retrieved.`,
    errorMessagePrefix: "Failed to load sprint details",
    successToastTitle: "Sprint Details Loaded",
    errorToastTitle: "Error Loading Sprint Details",
  });
};

export const getSprintListByProjectIdHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<Sprint[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return null;
  }

  return apiCall<Sprint[]>({
    url: `${SPRINT_URL}/project/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Sprints for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load sprints for project",
    successToastTitle: "Sprints Loaded",
    errorToastTitle: "Error Loading Sprints",
  });
};

export const getProjectHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<Project | null> => {
  if (!projectId) {
    options.setLoading(false);
    return null;
  }

  return apiCall<Project>({
    url: `${PROJECT_URL}/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Project ${projectId} details retrieved.`,
    errorMessagePrefix: "Failed to load project details",
    successToastTitle: "Project Details Loaded",
    errorToastTitle: "Error Loading Project Details",
  });
};

export const getProjectTeamDetailHelper = async (teamId: string, projectId: string, options: FetchEntitiesOptions): Promise<ProjectTeam | null> => {
  if (!teamId || !projectId) {
    options.setLoading(false);
    return null;
  }

  const payload = { id: teamId, projectId: projectId };

  return apiCall<ProjectTeam>({
    url: TEAM_DETAIL_URL,
    method: httpMethods.POST, // Assuming TEAM_DETAIL_URL uses POST with a body
    body: payload,
    setLoading: options.setLoading,
    successMessage: `Team ${teamId} details for project ${projectId} retrieved.`,
    errorMessagePrefix: "Failed to load project team details",
    successToastTitle: "Project Team Details Loaded",
    errorToastTitle: "Error Loading Project Team Details",
  });
};


export const getNonCompletedSprintsHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<Sprint[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<Sprint[]>({
    url: `${SPRINT_NON_COMPLETED_GET_ALL_URL}/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Non-completed sprints for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load non-completed sprints",
    successToastTitle: "Non-Completed Sprints Loaded",
    errorToastTitle: "Error Loading Non-Completed Sprints",
  });
};


export const createProjectTaskHelper = async (projectTaskData: any, options: FetchEntitiesOptions): Promise<ProjectTask | null> => {
  return apiCall<ProjectTask>({
    url: PROJECT_TASK,
    method: httpMethods.POST,
    body: projectTaskData,
    setLoading: options.setLoading,
    successMessage: "Project Task has been successfully created.",
    errorMessagePrefix: "Failed to create Project Task",
    successToastTitle: "Project Task Created",
    errorToastTitle: "Error Creating Project Task",
  });
};

export const updateProjectTaskHelper = async (taskId: string, projectTaskData: TaskUpdateRequest, options: FetchEntitiesOptions): Promise<ProjectTask | null> => {
  return apiCall<ProjectTask>({
    url: `${PROJECT_TASK}/${taskId}`,
    method: httpMethods.PUT,
    body: projectTaskData,
    setLoading: options.setLoading,
    successMessage: "Project Task has been successfully created.",
    errorMessagePrefix: "Failed to create Project Task",
    successToastTitle: "Project Task Created",
    errorToastTitle: "Error Creating Project Task",
  });
};

export const getAllProjectTaskHelper = async (page: number, size: number, filter: ProjectTaskFilterRequest, options: FetchEntitiesOptions): Promise<TaskResponse | null> => {
  return apiCall<TaskResponse>({
    url: PROJECT_TASK + "/filter/" + page + "/" + size,
    method: httpMethods.POST,
    body: filter,
    setLoading: options.setLoading,
    successMessage: "Project Task has been successfully created.",
    errorMessagePrefix: "Failed to create Project Task",
    successToastTitle: "Project Task Created",
    errorToastTitle: "Error Creating Project Task",
  });
};


export const getAllBacklogTaskHelper = async (page: number, size: number, filter: BacklogFilterRequest, options: FetchEntitiesOptions): Promise<TaskResponse | null> => {
  return apiCall<TaskResponse>({
    url: BACKLOG_URL + "/filter/" + page + "/" + size,
    method: httpMethods.POST,
    body: filter,
    setLoading: options.setLoading,
    successMessage: "Backlog Task has been successfully retrieved.",
    errorMessagePrefix: "Failed to retrieve Backlog Task",
    successToastTitle: "Backlog Task Retrieved",
    errorToastTitle: "Error Retrieving Backlog Task",
  });
};
export const getAllKanbanTaskHelper = async (page: number, size: number, filter: BacklogFilterRequest, options: FetchEntitiesOptions): Promise<TaskResponse | null> => {
  return apiCall<TaskResponse>({
    url: KANBAN_URL + "/filter/" + page + "/" + size,
    method: httpMethods.POST,
    body: filter,
    setLoading: options.setLoading,
    successMessage: "Kanban Task has been successfully retrieved.",
    errorMessagePrefix: "Failed to retrieve Kanban Task",
    successToastTitle: "Kanban Task Retrieved",
    errorToastTitle: "Error Retrieving Kanban Task",
  });
};

export const getProjectTaskByProjectTaskIdkHelper = async (taskId: string, options: FetchEntitiesOptions): Promise<ProjectTask | null> => {
  return apiCall<ProjectTask>({
    url: PROJECT_TASK + "/" + taskId,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Project Task for project ${taskId} have been retrieved.`,
    errorMessagePrefix: "Failed to load Project Task ",
    successToastTitle: "Project Task  Loaded",
    errorToastTitle: "Error Loading Project Task ",
  });
};

export const getSubTasksByProjectTaskIdkHelper = async (taskId: string, options: FetchEntitiesOptions): Promise<ProjectTask[] | null> => {
  return apiCall<ProjectTask[]>({
    url: PROJECT_TASK_SUBTASKS + "/" + taskId,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Project Sub Task for project ${taskId} have been retrieved.`,
    errorMessagePrefix: "Failed to load Project Sub Task ",
    successToastTitle: "Project Sub Task Loaded",
    errorToastTitle: "Error Loading Project Sub Task ",
  });
};

export const addTaskToSprintHelper = async (body: SprintTaskAddRequest, options: FetchEntitiesOptions): Promise<ProjectTask | null> => {
  return apiCall<ProjectTask>({
    url: SPRINT_TASK_ADD_URL,
    method: httpMethods.POST,
    body,
    setLoading: options.setLoading,
    successMessage: `Task has been added to the sprint.`,
    errorMessagePrefix: "Failed to add task to sprint",
    successToastTitle: "Task Added to Sprint",
    errorToastTitle: "Error Adding Task to Sprint",
  });
}
export const removeTaskFromSprintHelper = async (body: SprintTaskRemoveRequest, options: FetchEntitiesOptions): Promise<ProjectTask | null> => {
  return apiCall<ProjectTask>({
    url: SPRINT_TASK_REMOVE_URL,
    method: httpMethods.POST,
    body,
    setLoading: options.setLoading,
    successMessage: `Task has been removed from the sprint.`,
    errorMessagePrefix: "Failed to remove task from sprint",
    successToastTitle: "Task Removed from Sprint",
    errorToastTitle: "Error Removing Task from Sprint",
  });
}

export const getAllSprintTasksHelper = async (body: SprintTaskGetAllRequest, options: FetchEntitiesOptions): Promise<ProjectTask[] | null> => {
  return apiCall<ProjectTask[]>({
    url: SPRINT_TASK_GET_ALL_URL,
    method: httpMethods.POST,
    body,
    setLoading: options.setLoading,
    successMessage: `Tasks for sprint in project have been retrieved.`,
    errorMessagePrefix: "Failed to load sprint tasks",
    successToastTitle: "Sprint Tasks Loaded",
    errorToastTitle: "Error Loading Sprint Tasks",
  });
}

export const getAllInvitationsByPendingHelper = async (options: FetchEntitiesOptions): Promise<Invitation[] | null> => {
  return apiCall<Invitation[]>({
    url: INVITATION_BY_PENDING,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: "All invitations have been retrieved.",
    errorMessagePrefix: "Failed to load invitations",
    successToastTitle: "Invitations Loaded",
    errorToastTitle: "Error Loading Invitations",
  });
};
export const getAllInvitationsCountByInvitationStatusHelper = async (status: string, options: FetchEntitiesOptions): Promise<number | null> => {
  return apiCall<number>({
    url: `${INVITATION_PROJECT}/count/${status}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Count of invitations with status ${status} has been retrieved.`,
    errorMessagePrefix: "Failed to load invitations count",
    successToastTitle: "Invitations Count Loaded",
    errorToastTitle: "Error Loading Invitations Count",
  });
}

export const invitationAcceptHelper = async (invitationId: string, options: FetchEntitiesOptions): Promise<Invitation | null> => {
  return apiCall<Invitation>({
    url: INVITATION_ACCEPT,
    method: httpMethods.POST,
    body: { invitationId },
    setLoading: options.setLoading,
    successMessage: `Invitation ${invitationId} has been accepted.`,
    errorMessagePrefix: "Failed to accept invitation",
    successToastTitle: "Invitation Accepted",
    errorToastTitle: "Error Accepting Invitation",
  });
}
export const invitationDeclineHelper = async (invitationId: string, options: FetchEntitiesOptions): Promise<Invitation | null> => {
  return apiCall<Invitation>({
    url: INVITATION_DECLINE,
    method: httpMethods.POST,
    body: { invitationId },
    setLoading: options.setLoading,
    successMessage: `Invitation ${invitationId} has been declined.`,
    errorMessagePrefix: "Failed to decline invitation",
    successToastTitle: "Invitation Declined",
    errorToastTitle: "Error Declining Invitation",
  });
}



export const addProjectTeamUserHelper = async (projectTeamUserData: any, options: FetchEntitiesOptions): Promise<ProjectUser[] | null> => {
  return apiCall<ProjectUser[]>({
    url: `${TEAM_USER_URL}`,
    method: httpMethods.POST,
    body: projectTeamUserData,
    setLoading: options.setLoading,
    successMessage: "Project Team User has been successfully added.",
    errorMessagePrefix: "Failed to add Project Team User",
    successToastTitle: "Project Team User Added",
    errorToastTitle: "Error Adding Project Team User",
  });
}

export const removeProjectTeamUserHelper = async (projectTeamUserData: any, options: FetchEntitiesOptions): Promise<ProjectUser[] | null> => {
  return apiCall<ProjectUser[]>({
    url: `${TEAM_USER_REMOVE_URL}`,
    method: httpMethods.POST,
    body: projectTeamUserData,
    setLoading: options.setLoading,
    successMessage: "Project Team User has been successfully removed.",
    errorMessagePrefix: "Failed to remove Project Team User",
    successToastTitle: "Project Team User Removed",
    errorToastTitle: "Error Removing Project Team User",
  });
}

export const getProjectTeamUsersNotInTeamHelper = async (projectTeamUserData: any, options: FetchEntitiesOptions): Promise<ProjectUser[] | null> => {
  return apiCall<ProjectUser[]>({
    url: `${TEAM_USER_NOT_IN_URL}`,
    method: httpMethods.POST,
    body: projectTeamUserData,
    setLoading: options.setLoading,
    successMessage: "Project Team Users not in team have been successfully retrieved.",
    errorMessagePrefix: "Failed to load Project Team Users not in team",
    successToastTitle: "Project Team Users Not In Team Loaded",
    errorToastTitle: "Error Loading Project Team Users Not In Team",
  });
}

export const getProjectTeamUsersInTeamHelper = async (projectTeamUserData: any, options: FetchEntitiesOptions): Promise<ProjectUser[] | null> => {
  return apiCall<ProjectUser[]>({
    url: `${TEAM_USER_IN_URL}`,
    method: httpMethods.POST,
    body: projectTeamUserData,
    setLoading: options.setLoading,
    successMessage: "Project Team Users in team have been successfully retrieved.",
    errorMessagePrefix: "Failed to load Project Team Users in team",
    successToastTitle: "Project Team Users In Team Loaded",
    errorToastTitle: "Error Loading Project Team Users In Team",
  });
}
