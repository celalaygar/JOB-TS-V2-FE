// src/lib/service/api-helpers.ts

import BaseService from "@/lib/service/BaseService";
import { httpMethods } from "@/lib/service/HttpService";
import { toast } from "@/hooks/use-toast";
import type { ProjectUser } from "@/types/project";
import type { Sprint } from "@/types/sprint";
import type { ProjectTeam, Project } from "@/types/project";
import { GET_PROJECT_USERS, SPRINT_NON_COMPLETED_GET_ALL_URL, PROJECT_TEAM_URL, PROJECT_URL, SPRINT_GET_ALL_URL } from "@/lib/service/BasePath";

interface ApiOperationConfig<T> {
  url: string;
  method: httpMethods;
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
    const response: T = await BaseService.request(url, { method, body });

    if (successMessage) {
      toast({
        title: successToastTitle || "Success",
        description: successMessage,
        variant: "default",
      });
    }

    return response;
  } catch (error: any) {
    console.error(`${errorMessagePrefix}:`, error);

    const errorMessage = error.message || "An unexpected error occurred.";

    let displayErrorTitle = errorToastTitle || errorMessagePrefix;
    let displayErrorDescription = errorMessage;

    if (error.status === 400) {
      displayErrorTitle = "Bad Request (400)";
      displayErrorDescription = errorMessage;
    } else if (error.status === 500) {
      displayErrorTitle = "Server Error (500)";
      displayErrorDescription = "There was a server error. Please try again later.";
    }

    toast({
      title: displayErrorTitle,
      description: displayErrorDescription,
      variant: "destructive",
    });

    return null;
  } finally {
    setLoading(false);
  }
}

interface FetchEntitiesOptions {
  setLoading: (loading: boolean) => void;
}

export const getProjectUsersHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<ProjectUser[] | null> => {
  if (!projectId) {
    options.setLoading(false);
    return [];
  }

  return apiCall<ProjectUser[]>({
    url: `${GET_PROJECT_USERS}/${projectId}`,
    method: httpMethods.GET,
    setLoading: options.setLoading,
    successMessage: `Users for project ${projectId} have been retrieved.`,
    errorMessagePrefix: "Failed to load project users",
    successToastTitle: "Project Users Loaded",
    errorToastTitle: "Error Loading Project Users",
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

export const getAllProjectTeamsHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<ProjectTeam[] | null> => {
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
