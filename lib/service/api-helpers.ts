// src/lib/service/api-helpers.ts

import BaseService from "@/lib/service/BaseService";
import { httpMethods } from "@/lib/service/HttpService";
import { toast } from "@/hooks/use-toast"; // Assuming this path for your toast utility
import type { ProjectUser } from "@/types/project"; // Import necessary types
import type { Sprint } from "@/types/sprint";
import { GET_PROJECT_USERS, SPRINT_NON_COMPLETED_GET_ALL_URL } from "@/lib/service/BasePath"; // Ensure these paths are correct

/**
 * Interface for options passed to the generic API call helper.
 * @template T - The expected type of the response data.
 */
interface ApiOperationConfig<T> {
  url: string;
  method: httpMethods;
  body?: any; // Request body, optional for GET requests
  setLoading: (loading: boolean) => void; // State setter for loading status
  successMessage?: string; // Message for successful toast notification
  errorMessagePrefix?: string; // Prefix for error messages in console and toast
  successToastTitle?: string; // Title for successful toast notification
  errorToastTitle?: string; // Title for error toast notification
}

/**
 * A generic API call helper function that handles loading states,
 * success notifications, and comprehensive error handling with toast messages.
 * It specifically distinguishes between 400 (Bad Request) and 500 (Server Error) status codes.
 *
 * @template T - The expected type of the response data.
 * @param {ApiOperationConfig<T>} config - Configuration object for the API call.
 * @returns {Promise<T | null>} - A promise that resolves with the response data (type T) on success,
 * or null on failure after handling errors.
 */
export async function apiCall<T>(config: ApiOperationConfig<T>): Promise<T | null> {
  const {
    url,
    method,
    body,
    setLoading,
    successMessage,
    errorMessagePrefix = "Operation failed", // Default prefix for errors
    successToastTitle,
    errorToastTitle,
  } = config;

  setLoading(true); // Set loading to true before the API request

  try {
    // Make the actual API request using BaseService
    const response: T = await BaseService.request(url, { method, body });

    // Show a success toast if a success message is provided
    if (successMessage) {
      toast({
        title: successToastTitle || "Success",
        description: successMessage,
        variant: "default",
      });
    }

    return response; // Return the successful response data
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error(`${errorMessagePrefix}:`, error);

    // Determine the error message to display to the user
    const errorMessage = error.message || "An unexpected error occurred.";

    let displayErrorTitle = errorToastTitle || errorMessagePrefix;
    let displayErrorDescription = errorMessage;

    // Handle specific HTTP status codes
    if (error.status === 400) {
      displayErrorTitle = "Bad Request (400)";
      displayErrorDescription = errorMessage; // Use the specific error message from the backend
    } else if (error.status === 500) {
      displayErrorTitle = "Server Error (500)";
      displayErrorDescription = "There was a server error. Please try again later."; // Generic message for server errors
    }

    // Show an error toast notification
    toast({
      title: displayErrorTitle,
      description: displayErrorDescription,
      variant: "destructive",
    });

    return null; // Return null to indicate failure
  } finally {
    setLoading(false); // Always set loading to false after the request completes (success or failure)
  }
}

/**
 * Interface for common options required by data fetching helpers.
 */
interface FetchEntitiesOptions {
  setLoading: (loading: boolean) => void; // Setter for a specific loading state
}

/**
 * Helper function to fetch project users for a given project ID.
 * Utilizes the generic `apiCall` for consistent handling.
 *
 * @param {string} projectId - The ID of the project to fetch users for.
 * @param {FetchEntitiesOptions} options - Options object containing the setLoading function.
 * @returns {Promise<ProjectUser[] | null>} - A promise that resolves with an array of ProjectUser objects or null on error.
 */
export const getProjectUsersHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<ProjectUser[] | null> => {
  // If no project ID is provided, clear loading and return an empty array (or null based on desired behavior)
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
    errorToastTitle: "Error Loading Project Users", // Specific title for error toast
  });
};

/**
 * Helper function to fetch non-completed sprints for a given project ID.
 * Utilizes the generic `apiCall` for consistent handling.
 *
 * @param {string} projectId - The ID of the project to fetch sprints for.
 * @param {FetchEntitiesOptions} options - Options object containing the setLoading function.
 * @returns {Promise<Sprint[] | null>} - A promise that resolves with an array of Sprint objects or null on error.
 */
export const getSprintsHelper = async (projectId: string, options: FetchEntitiesOptions): Promise<Sprint[] | null> => {
  // If no project ID is provided, clear loading and return an empty array (or null based on desired behavior)
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
    errorToastTitle: "Error Loading Sprints", // Specific title for error toast
  });
};

// Example of how a project creation helper might look, refactoring the original saveTask's intent.
// This is not used in the main component's task creation flow but demonstrates the pattern.
/*
import { PROJECT_URL } from "@/lib/service/BasePath"; // Ensure PROJECT_URL is defined

export const createProjectHelper = async (projectData: any, options: FetchEntitiesOptions): Promise<any | null> => {
  return apiCall<any>({
    url: PROJECT_URL,
    method: httpMethods.POST,
    body: projectData,
    setLoading: options.setLoading,
    successMessage: "Project has been successfully saved.",
    errorMessagePrefix: "Failed to save project",
    successToastTitle: "Project Saved",
    errorToastTitle: "Error Saving Project",
  });
};
*/
