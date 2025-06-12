"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Filter,
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  MapPin,
  GraduationCap,
  Award,
  Loader2,
} from "lucide-react"
import type { Project, ProjectUser } from "@/types/project"
import type { User } from "@/types/user"
import { InviteUserDialog } from "./dialogs/invite-user-dialog"
import BaseService from "@/lib/service/BaseService"
import { GET_PROJECT_USERS } from "@/lib/service/BasePath"
import { httpMethods } from "@/lib/service/HttpService"
import { toast } from "@/hooks/use-toast"

interface ProjectUsersTabProps {
  project: Project
  onInviteClick: () => void
  inviteDialogOpen?: boolean
  setInviteDialogOpen?: (open: boolean) => void
}

export function ProjectUsersTab({
  project,
  onInviteClick,
  inviteDialogOpen = false,
  setInviteDialogOpen = () => { },
}: ProjectUsersTabProps) {
  const [projectUsers, setprojectUsers] = useState<ProjectUser[]>()


  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const [loading, setLoading] = useState(false);


  const getProjectUsers = async () => {
    setLoading(true)
    try {
      const response: ProjectUser[] = await BaseService.request(GET_PROJECT_USERS + "/" + project.id, {
        method: httpMethods.GET,
      })
      toast({
        title: `Get All Invitations.`,
        description: `Get All Invitations `,
      })
      setprojectUsers(response)

    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Get Project Users failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Get Project Users failed:', error)
        toast({
          title: `Get Project Users failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }

  const getAll = useCallback(async () => {
    await getProjectUsers()
  }, [])

  useEffect(() => {
    getAll()
  }, [getAll])


  // Get unique values for filter dropdowns
  const uniqueRoles = projectUsers && Array.from(new Set(projectUsers.map((user) => user.role)))
  const uniqueDepartments = projectUsers && Array.from(new Set(projectUsers.map((user) => user.department).filter(Boolean)))

  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return loading ? (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </>
  ) : (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Project Users ({projectUsers && projectUsers.length})</h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Role</p>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {uniqueRoles && uniqueRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Status</p>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Department</p>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {uniqueDepartments && uniqueDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
            <Button onClick={onInviteClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projectUsers && projectUsers.map((user: ProjectUser) => (
              <div key={user.id} className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.firstname + " " + user.lastname}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-medium text-primary">
                            {user.firstname.charAt(0) + " " + user.lastname.charAt(0) || "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.firstname + " " + user.lastname}</h3>
                        <p className="text-sm text-muted-foreground">{user.title || "Team Member"}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove from Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.systemRoles}</span>
                    </div>
                    {user.department && (
                      <div className="flex items-center text-sm">
                        <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.department}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"
                      }
                    >
                      {user.status === "active"
                        ? "Active"
                        : user.status === "inactive"
                          ? "Inactive"
                          : user.status === "pending"
                            ? "Pending"
                            : "Unknown"}
                    </Badge>
                    {user.workHours && <Badge variant="outline">{user.workHours}</Badge>}
                    {user.skills?.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                    {user.skills && user.skills?.length > 2 && (
                      <Badge variant="outline">+{user.skills?.length - 2} more</Badge>
                    )}
                  </div>

                  {(user.certifications?.length > 0 || user.languages?.length > 0) && (
                    <div className="mt-4 pt-4 border-t">
                      {user.certifications?.length > 0 && (
                        <div className="mb-2">
                          <div className="flex items-center text-sm mb-1">
                            <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Certifications</span>
                          </div>
                          <div className="text-sm text-muted-foreground pl-6">{user.certifications?.join(", ")}</div>
                        </div>
                      )}

                      {user.languages?.length && user.languages?.length > 0 && (
                        <div>
                          <div className="flex items-center text-sm mb-1">
                            <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Languages</span>
                          </div>
                          <div className="text-sm text-muted-foreground pl-6">{user.languages.join(", ")}</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => { }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium">User</th>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Department</th>
                    <th className="text-left p-3 font-medium hidden lg:table-cell">Skills</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectUsers && projectUsers.map((user: ProjectUser, index) => (
                    <tr key={user.id} className={"bg-white"}>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                              <img
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.firstname + " " + user.lastname}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-primary">
                                {user.initials || user.firstname.charAt(0) + " " + user.lastname.charAt(0) || "?"}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.firstname + " " + user.lastname}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{user.systemRoles}</div>
                        <div className="text-sm text-muted-foreground">{user.title}</div>
                      </td>
                      <td className="p-3 hidden md:table-cell">{user.department || "—"}</td>
                      <td className="p-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {user.skills?.slice(0, 2).map((skill, i) => (
                            <Badge key={i} variant="outline" className="mr-1">
                              {skill}
                            </Badge>
                          ))}
                          {user.skills && user.skills.length > 2 && (
                            <Badge variant="outline">+{user.skills?.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"
                          }
                        >
                          {user.status === "active"
                            ? "Active"
                            : user.status === "inactive"
                              ? "Inactive"
                              : user.status === "pending"
                                ? "Pending"
                                : "Unknown"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {projectUsers && projectUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <UserPlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No users found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || roleFilter !== "all" || statusFilter !== "all" || departmentFilter !== "all"
                ? "Try adjusting your search or filters"
                : "This project doesn't have any users yet"}
            </p>
            <Button onClick={onInviteClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Users
            </Button>
          </div>
        )}


        <InviteUserDialog project={project} open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
      </div>
    </>
  )
}
