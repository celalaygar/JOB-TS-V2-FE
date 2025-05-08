"use client"

import { useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { removeRole, moveRoleUp, moveRoleDown } from "@/lib/redux/features/project-roles-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Trash2, Edit, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
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
import type { ProjectRole } from "@/types/project-role"

interface ProjectRolesManagementProps {
  projectId: string
}

export function ProjectRolesManagement({ projectId }: ProjectRolesManagementProps) {
  const dispatch = useDispatch()
  const allRoles = useSelector((state: RootState) => state.projectRoles.roles)
  const projectRoles = allRoles.filter((role) => role.projectId === projectId)

  const [searchQuery, setSearchQuery] = useState("")
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false)
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<ProjectRole | null>(null)
  const [sortField, setSortField] = useState<keyof ProjectRole>("order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Sort and filter roles
  const filteredAndSortedRoles = useMemo(() => {
    return [...projectRoles]
      .filter((role) => {
        return (
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
      .sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        return 0
      })
  }, [projectRoles, searchQuery, sortField, sortDirection])

  // Handle sorting
  const handleSort = (field: keyof ProjectRole) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle role deletion
  const handleDeleteRole = () => {
    if (selectedRole) {
      dispatch(removeRole(selectedRole.id))
      setDeleteDialogOpen(false)
      setSelectedRole(null)
    }
  }

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

                {filteredAndSortedRoles.length > 0 ? (
                  filteredAndSortedRoles.map((role, index) => {
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
                              disabled={index === filteredAndSortedRoles.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                              <span className="sr-only">Move down</span>
                            </Button>
                          </div>
                        </div>
                        <div className="col-span-3 flex items-center">
                          <div>
                            <span className="font-medium text-[var(--fixed-sidebar-fg)]">{role.name}</span>
                            {role.isDefault && (
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

      {/* Add Role Dialog */}
      <AddRoleDialog open={addRoleDialogOpen} onOpenChange={setAddRoleDialogOpen} projectId={projectId} />

      {/* Edit Role Dialog */}
      <EditRoleDialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen} role={selectedRole} />

      {/* Delete Confirmation Dialog */}
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
  )
}
