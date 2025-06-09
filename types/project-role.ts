export interface ProjectRolePermission {
  id: string;
  labelEn: string;
  labelTr: string;
  category: string;
}



export interface ProjectRoleRequest {
  projectId: string
  name: string
  description: string
  permissions: string[]
  isDefaultRole: boolean
}

export interface ProjectRole {
  id: string | null | undefined
  projectId: string
  name: string
  description: string
  permissions: string[]
  isDefaultRole: boolean
  isDefault: boolean | null | undefined
  order: number | null | undefined
  createdAt: string | null | undefined
  updatedAt: string | null | undefined
}

export type Permission =
  | "view_project"
  | "edit_project"
  | "delete_project"
  | "create_task"
  | "edit_task"
  | "delete_task"
  | "assign_task"
  | "create_issue"
  | "edit_issue"
  | "delete_issue"
  | "assign_issue"
  | "manage_roles"
  | "invite_members"
  | "remove_members"
  | "view_reports"
  | "manage_sprints"
  | "manage_backlog"
  | "manage_status"
  | "comment"
  | "upload_files"
  | "admin"

export const permissionGroups = {
  project: ["view_project", "edit_project", "delete_project"],
  task: ["create_task", "edit_task", "delete_task", "assign_task"],
  issue: ["create_issue", "edit_issue", "delete_issue", "assign_issue"],
  team: ["manage_roles", "invite_members", "remove_members"],
  other: ["view_reports", "manage_sprints", "manage_backlog", "manage_status", "comment", "upload_files", "admin"],
}
