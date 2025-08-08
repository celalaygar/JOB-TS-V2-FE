import { ProjectTaskPriority, ProjectTaskType } from "./task";

export interface KanbanFilterRequest {
    searchText?: string;
    taskNumber?: string;
    title?: string;
    description?: string;
    projectTaskStatusId?: string;
    projectId?: string;
    assigneeId?: string;
    sprintId?: string;
    taskType?: string;
}