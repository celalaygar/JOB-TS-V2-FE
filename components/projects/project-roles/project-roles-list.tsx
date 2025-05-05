"use client"
import { useDispatch } from "react-redux"
import { moveRoleUp, moveRoleDown } from "@/lib/redux/features/project-roles-slice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpDown, ChevronDown, ChevronUp, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import type { ProjectRole } from "@/types/project-role"

interface ProjectRolesListProps {
  roles: ProjectRole[]
  onEditRole: (role: ProjectRole) => void
  onDeleteRole: (role: ProjectRole) => void
  sortField: keyof ProjectRole
  sortDirection: "asc" | "desc"
  onSort: (field: keyof ProjectRole) => void
}

export function ProjectRolesList({
  roles,
  onEditRole,
  onDeleteRole,
  sortField,
  sortDirection,
  onSort,
}: ProjectRolesListProps) {
  const dispatch = useDispatch()

  // Count permissions by category
  const countPermissionsByCategory = (permissions: string[]) => {
    const counts = {
      project: 0,
      task: 0,
      issue: 0,
      team: 0,
      other: 0,
    }

    permissions.forEach((permission) => {
      if (
        permission.startsWith("view_project") ||
        permission.startsWith("edit_project") ||
        permission.startsWith("delete_project")
      ) {
        counts.project++
      } else if (permission.includes("task")) {
        counts.task++
      } else if (permission.includes("issue")) {
        counts.issue++
      } else if (permission.includes("member") || permission.includes("role")) {
        counts.team++
      } else {
        counts.other++
      }
    })

    return counts
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-2 p-4 bg-[var(--fixed-secondary)] text-sm font-medium">
        <div className="col-span-1 flex items-center cursor-pointer" onClick={() => onSort("order")}>
          <span>Order</span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
        </div>
        <div className="col-span-3 flex items-center cursor-pointer" onClick={() => onSort("name")}>
          <span>Role Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
        </div>
        <div className="col-span-4 hidden md:flex items-center">
          <span>Description</span>
        </div>
        <div className="col-span-3 md:col-span-3 flex items-center">
          <span>Permissions</span>
        </div>
        <div className="col-span-1 flex items-center justify-end">
          <span className="sr-only">Actions</span>
        </div>
      </div>

      {roles.length > 0 ? (
        roles.map((role, index) => {
          const permissionCounts = countPermissionsByCategory(role.permissions)

          return (
            <div
              key={role.id}
              className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-[var(--fixed-secondary)] transition-colors"
            >
              <div className="col-span-1 flex items-center gap-2">
                <span className="font-medium">{role.order || index + 1}</span>
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={() => dispatch(moveRoleUp(role.id))}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                    <span className="sr-only">Move up</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={() => dispatch(moveRoleDown(role.id))}
                    disabled={index === roles.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                    <span className="sr-only">Move down</span>
                  </Button>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <div>
                  <span className="font-medium text-[var(--fixed-sidebar-fg)]">{role.name}</span>
                  {role.isDefault && <Badge className="ml-2 bg-[var(--fixed-primary)] text-white">Default</Badge>}
                </div>
              </div>
              <div className="col-span-4 hidden md:flex items-center">
                <span className="text-[var(--fixed-sidebar-muted)] truncate">{role.description}</span>
              </div>
              <div className="col-span-3 md:col-span-3 flex flex-wrap items-center gap-1">
                {permissionCounts.project > 0 && (
                  <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                    Project: {permissionCounts.project}
                  </Badge>
                )}
                {permissionCounts.task > 0 && (
                  <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                    Task: {permissionCounts.task}
                  </Badge>
                )}
                {permissionCounts.issue > 0 && (
                  <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                    Issue: {permissionCounts.issue}
                  </Badge>
                )}
                {permissionCounts.team > 0 && (
                  <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                    Team: {permissionCounts.team}
                  </Badge>
                )}
                {permissionCounts.other > 0 && (
                  <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                    Other: {permissionCounts.other}
                  </Badge>
                )}
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditRole(role)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteRole(role)}
                      className="text-[var(--fixed-danger)]"
                      disabled={role.isDefault}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })
      ) : (
        <div className="p-8 text-center">
          <p className="text-[var(--fixed-sidebar-muted)]">No roles found matching your search.</p>
        </div>
      )}
    </div>
  )
}
