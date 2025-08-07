import { ProjectTaskPriority, ProjectTaskType } from "./task";

export interface BacklogFilterRequest {
    searchText?: string;
    taskNumber?: string;
    title?: string;
    description?: string;
    projectTaskStatusId?: string;
    projectId?: string;
    assigneeId?: string;
    priority?: ProjectTaskPriority;
    taskType?: string;
}