"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { removeRole, moveRoleUp, moveRoleDown, setProjectsRole } from "@/lib/redux/features/project-roles-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Trash2, Edit, ArrowUpDown, ChevronUp, ChevronDown, Loader2 } from "lucide-react"
import { AddRoleDialog } from "./add-role-dialog"
import { EditRoleDialog } from "./edit-role-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProjectRole, ProjectRolePermission } from "@/types/project-role"
import { Project } from "@/types/project"
import { getAllProjectsRolesHelper, getAllProjectsRolePermissionsHelper } from "@/lib/service/api-helpers"

interface ProjectRolesManagementProps {
  project: Project | {}
  projectId: string
}

export function ProjectRolesManagement({ project, projectId }: ProjectRolesManagementProps) {
  const dispatch = useDispatch()
  const allRoles = useSelector((state: RootState) => state.projectRoles.roles)

  const [searchQuery, setSearchQuery] = useState("")
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false)
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<ProjectRole | null>(null)
  const [sortField, setSortField] = useState<keyof ProjectRole>("order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(false);
  const [projectRoleList, setProjectRoleList] = useState<ProjectRole[] | null>(null)
  const [permissionList, setPermissionList] = useState<ProjectRolePermission[] | null>(null)


  const fetchProjectsRoles = useCallback(async () => {
    const rolesData = await getAllProjectsRolesHelper(projectId, { setLoading });
    if (rolesData) {
      setProjectRoleList(rolesData);
      dispatch(setProjectsRole(rolesData));
    } else {
      setProjectRoleList([]);
    }
  }, [projectId, dispatch]);

  const fetchProjectsRolePermissions = useCallback(async () => {
    const permissionsData = await getAllProjectsRolePermissionsHelper({ setLoading });
    if (permissionsData) {
      setPermissionList(permissionsData);
    } else {
      setPermissionList([]);
    }
  }, []);

  useEffect(() => {
    fetchProjectsRoles();
    fetchProjectsRolePermissions();
  }, [fetchProjectsRoles, fetchProjectsRolePermissions]);

  const handleSort = (field: keyof ProjectRole) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDeleteRole = () => {
    if (selectedRole) {
      dispatch(removeRole(selectedRole.id))
      setDeleteDialogOpen(false)
      setSelectedRole(null)
    }
  }

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

  return loading ? (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </>
  ) : (
    <>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
          <Button className="bg-[var(--fixed-primary)] text-white" onClick={() => setAddRoleDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>

        <Card className="fixed-card">
          <CardHeader>
            <CardTitle>Project Roles</CardTitle>
            <CardDescription className="text-[var(--fixed-sidebar-muted)]">
              Manage roles and permissions for this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  <Input
                    placeholder="Search roles..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={sortField as string} onValueChange={(value: any) => setSortField(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="updatedAt">Updated Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                >
                  {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="min-w-[768px] rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-[var(--fixed-secondary)] text-sm font-medium">
                    <div className="col-span-1 flex items-center cursor-pointer" onClick={() => handleSort("order")}>
                      <span>Order</span>
                      <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                    </div>
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort("name")}>
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

                  {allRoles && allRoles.length > 0 ? (
                    allRoles.map((role: ProjectRole, index) => {
                      const permissionCounts = countPermissionsByCategory(role.permissions)

                      return (
                        <div
                          key={role.id}
                          className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-[var(--fixed-secondary)] transition-colors"
                        >
                          <div className="col-span-1 flex items-center gap-2">
                            <span className="font-medium">{index + 1}</span>
                          </div>
                          <div className="col-span-3 flex items-center">
                            <div>
                              <span className="font-medium text-[var(--fixed-sidebar-fg)]">{role.name}</span>
                              {role.isDefaultRole && (
                                <Badge className="ml-2 bg-[var(--fixed-primary)] text-white">Default</Badge>
                              )}
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
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRole(role)
                                    setEditRoleDialogOpen(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRole(role)
                                    setDeleteDialogOpen(true)
                                  }}
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
              </div>
            </div>
          </CardContent>
        </Card>

        <AddRoleDialog open={addRoleDialogOpen} permissionList={permissionList} onOpenChange={setAddRoleDialogOpen} projectId={projectId} />

        <EditRoleDialog open={editRoleDialogOpen} permissionList={permissionList} onOpenChange={setEditRoleDialogOpen} projectId={projectId} role={selectedRole} />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this role?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Users with this role will lose their permissions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRole}
                className="bg-[var(--fixed-danger)] text-white hover:bg-[var(--fixed-danger)]/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
