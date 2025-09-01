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
import { ProjectSystemRole, type Project, type ProjectUser, type RemoveProjectUserRequest } from "@/types/project"
import { InviteUserDialog } from "./dialogs/invite-user-dialog"
import { getActiveProjectUsersHelper, getAllProjectUsersHelper, removeProjectUserHelper } from "@/lib/service/api-helpers"
import { RemoveUserDialog } from "./dialogs/remove-user-dialog copy"
import { useLanguage } from "@/lib/i18n/context"

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
  const { translations } = useLanguage()

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isOpenRemoveUserDialog, setIsOpenRemoveUserDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ProjectUser | null>(null)

  const [loading, setLoading] = useState(false);
  const [projectUsers, setprojectUsers] = useState<ProjectUser[]>()

  const fetchProjectUsers = useCallback(async () => {
    const usersData = await getAllProjectUsersHelper(project.id, { setLoading });
    if (usersData) {
      setprojectUsers(usersData);
    } else {
      setprojectUsers([]);
    }
  }, [project.id]);

  useEffect(() => {
    fetchProjectUsers();
  }, [fetchProjectUsers]);

  const uniqueRoles = projectUsers && Array.from(new Set(projectUsers.map((user) => user.role)))
  const uniqueDepartments = projectUsers && Array.from(new Set(projectUsers.map((user) => user.department).filter(Boolean)))

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")


  const openRemoveUserDialogForm = (user: ProjectUser) => {
    setSelectedUser(user);
    setIsOpenRemoveUserDialog(true);
  }

  const removeUserFromProject = async (projectUser: ProjectUser) => {
    if (!project.id) return;
    let body: RemoveProjectUserRequest = {
      projectId: project.id,
      projectUserId: projectUser.id,
      userId: projectUser.userId,
    }
    const response = await removeProjectUserHelper(body, { setLoading });
    if (response) {

      let users = projectUsers?.map((user) => {
        if (user.id === response.id) {
          return { ...response }
        }
        return user;
      });
      setprojectUsers(users);
      setSelectedUser(null);
    }
  }



  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  ) : (

    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">
            {translations.projects.users} ({projectUsers?.length || 0})
          </h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={translations.projects.searchUsers}
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
                  <p className="text-sm font-medium mb-2">{translations.projects.role}</p>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations.projects.filterByRole} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{translations.projects.allRoles}</SelectItem>
                      {uniqueRoles?.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">{translations.projects.status}</p>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations.projects.filterByStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{translations.projects.allStatuses}</SelectItem>
                      <SelectItem value="active">{translations.projects.active}</SelectItem>
                      <SelectItem value="inactive">{translations.projects.inactive}</SelectItem>
                      <SelectItem value="pending">{translations.projects.pending}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">{translations.projects.department}</p>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations.projects.filterByDepartment} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{translations.projects.allDepartments}</SelectItem>
                      {uniqueDepartments?.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
                {translations.projects.grid}
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                {translations.projects.list}
              </Button>
            </div>
            <Button onClick={onInviteClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              {translations.projects.inviteUser}
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
                        {user.firstname && user.lastname ? (
                          <img
                            src={"/placeholder.svg"}
                            alt={user.firstname + " " + user.lastname}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-medium text-primary">
                            {user.firstname?.charAt(0) + " " + user.lastname?.charAt(0) || "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.firstname + " " + user.lastname}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.projectSystemRole === ProjectSystemRole.PROJECT_REMOVED_USER
                            ? "Removed from project"
                            : user.projectSystemRole === ProjectSystemRole.PROJECT_OWNER
                              ? "Project Owner"
                              : user.projectSystemRole === ProjectSystemRole.PROJECT_ADMIN
                                ? "Project Admin"
                                : user.projectSystemRole === ProjectSystemRole.PROJECT_DELETED_USER ?
                                  "Deleted User"
                                  : user.projectSystemRole === ProjectSystemRole.PROJECT_PASSIVE_USER ?
                                    "Passive User"
                                    : user.projectSystemRole === ProjectSystemRole.PROJECT_USER ?
                                      "Project User"
                                      : "Unknown Role"
                          }

                        </p>
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
                          {translations.projects.viewDetails}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          {translations.projects.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openRemoveUserDialogForm(user)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {translations.projects.remove}
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
                      <span className="text-muted-foreground">
                        {user.projectSystemRole === ProjectSystemRole.PROJECT_REMOVED_USER
                          ? "Removed from project"
                          : user.projectSystemRole === ProjectSystemRole.PROJECT_OWNER
                            ? "🏆 " + "Project Owner"
                            : user.projectSystemRole === ProjectSystemRole.PROJECT_ADMIN
                              ? "🏆 " + "Project Admin"
                              : user.projectSystemRole === ProjectSystemRole.PROJECT_DELETED_USER ?
                                "Deleted User"
                                : user.projectSystemRole === ProjectSystemRole.PROJECT_PASSIVE_USER ?
                                  "Passive User"
                                  : user.projectSystemRole === ProjectSystemRole.PROJECT_USER ?
                                    "Project User"
                                    : "Unknown Role"
                        }
                      </span>
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



                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => { }}>
                      <Eye className="mr-2 h-4 w-4" />
                      {translations.projects.viewDetails}
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
                    <th className="text-left p-3 font-medium">{translations.projects.users}</th>
                    <th className="text-left p-3 font-medium">{translations.projects.role}</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Department</th>
                    <th className="text-left p-3 font-medium hidden lg:table-cell">Skills</th>
                    <th className="text-left p-3 font-medium">{translations.projects.status}</th>
                    <th className="text-left p-3 font-medium">{translations.projects.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {projectUsers && projectUsers.map((user: ProjectUser, index) => (
                    <tr key={user.id} className={"bg-white"}>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {user.firstname && user.lastname ? (
                              <img
                                src={"/placeholder.svg"}
                                alt={user.firstname + " " + user.lastname}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-primary">
                                {user.initials || user.firstname?.charAt(0) + " " + user.lastname?.charAt(0) || "?"}
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
                        <div className="font-medium">{user.projectSystemRole}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.projectSystemRole === ProjectSystemRole.PROJECT_REMOVED_USER
                            ? "Removed from project"
                            : user.projectSystemRole === ProjectSystemRole.PROJECT_OWNER
                              ? "Project Owner"
                              : user.projectSystemRole === ProjectSystemRole.PROJECT_ADMIN
                                ? "Project Admin"
                                : user.projectSystemRole === ProjectSystemRole.PROJECT_DELETED_USER ?
                                  "Deleted User"
                                  : user.projectSystemRole === ProjectSystemRole.PROJECT_PASSIVE_USER ?
                                    "Passive User"
                                    : user.projectSystemRole === ProjectSystemRole.PROJECT_USER ?
                                      "Project User"
                                      : "Unknown Role"
                          }
                        </div>
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
                                : user.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            {translations.projects.viewDetails}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openRemoveUserDialogForm(user)}>
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


        {projectUsers?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <UserPlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">{translations.projects.noUsersFound}</h3>
            <p className="text-muted-foreground mb-4">{translations.projects.tryAdjustingSearch}</p>
            <Button onClick={onInviteClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              {translations.projects.inviteUsers}
            </Button>
          </div>
        )}


        <InviteUserDialog project={project} open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />

        <RemoveUserDialog
          loading={loading}
          project={project}
          open={isOpenRemoveUserDialog}
          onOpenChange={setIsOpenRemoveUserDialog}
          projectUser={selectedUser!} // Ensure selectedUser is not null
          removeUserFromProject={removeUserFromProject}
        />

      </div>
    </>
  )
}
