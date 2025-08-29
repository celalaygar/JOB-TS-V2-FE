import { ChangePasswordRequest, ChangePasswordResponse, RegisterRequest, UserDto } from "@/types/user";
import { apiCall, FetchEntitiesOptions } from "../api-helpers";
import {
    UPDATE_STATUS_URL,
    SPRINT_STATUS_COMPLETE_URL,
    SPRINT_BULK_REMOVE_URL,
    SPRINT_GET_ALL_USER_URL,
    SPRINT_BULK_ADD_URL,
    SPRINT_GET_ALL_URL,
    SPRINT_TASK_GET_ALL_URL,
    SPRINT_TASK_REMOVE_URL,
    SPRINT_TASK_ADD_URL
} from "../BasePath";
import { httpMethods } from "../HttpService";
import { AddUserToSprintRequest, CompletionResponseDto, RemoveUserFromSprintRequest, Sprint, SprintRequest, SprintTaskAddRequest, SprintTaskGetAllRequest, SprintTaskRemoveRequest, SprintUser, UpdateSprintStatusRequest } from "@/types/sprint";
import { ProjectTask } from "@/types/task";





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

export const completeSprintHelper = async (body: UpdateSprintStatusRequest, options: FetchEntitiesOptions): Promise<CompletionResponseDto | null> => {
    return apiCall<CompletionResponseDto>({
        url: SPRINT_STATUS_COMPLETE_URL,
        method: httpMethods.POST,
        body: body,
        setLoading: options.setLoading,
        successMessage: "Sprint has been successfully completed.",
        errorMessagePrefix: "Failed to complete Sprint",
        successToastTitle: "Sprint completed",
        errorToastTitle: "Error completing Sprint",
    });
}


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

