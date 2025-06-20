"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Plus, Search, Filter, Bug, Lightbulb, BookOpen, GitBranch, Loader2 } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { GET_PROJECT_USERS, PROJECT_TASK_STATUS_URL, PROJECT_URL } from "@/lib/service/BasePath"
import BaseService from "@/lib/service/BaseService"
import { httpMethods } from "@/lib/service/HttpService"
import { Project, ProjectTaskStatus, ProjectUser } from "@/types/project"
import { toast } from "@/hooks/use-toast"

interface TasksHeaderProps {
  filters: {
    search: string
    project: string
    status: string
    priority: string
    assignee: string
    taskType: string
  }
  setFilters: (filters: any) => void
}

export function TasksHeader({ filters, setFilters }: TasksHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const users = useSelector((state: RootState) => state.users.users)


  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState<Project[] | []>([]);
  const [projectTaskStatus, setProjectTaskStatus] = useState<ProjectTaskStatus[]>([])
  const [projectUsers, setprojectUsers] = useState<ProjectUser[]>()

  const getAllProjects = useCallback(async () => {
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_URL, {
        method: httpMethods.GET,
      })
      let projectList = response as Project[];
      setProjectList(projectList)
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Project failed:', error)
        toast({
          title: `Project find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }, [])


  useEffect(() => {
    getAllProjects()
  }, [getAllProjects])


  const getAllProjectTaskStatus = async (projectId: string) => {
    setProjectTaskStatus([])
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_TASK_STATUS_URL + "/project/" + projectId, {
        method: httpMethods.GET
      })
      toast({
        title: `Project Task Status get All.`,
        description: `Project Task Status get All `,
      })
      setProjectTaskStatus(response as ProjectTaskStatus[])
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Projects Task Status  failed:', error)
        toast({
          title: `Projects Task Status  find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }
  const getProjectUsers = async (projectId: string) => {
    setLoading(true)
    setprojectUsers([])
    try {
      const response: ProjectUser[] = await BaseService.request(GET_PROJECT_USERS + "/" + projectId, {
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
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    if (key === "project" && !!value && value !== "all") {
      getAllProjectTaskStatus(value)
      getProjectUsers(value)
    }
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-[var(--fixed-sidebar-muted)]">Manage and track your project tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[var(--fixed-primary)] text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {
        loading ?
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </div>
          :
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8 border-[var(--fixed-card-border)]"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="border-[var(--fixed-card-border)]"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters {showFilters ? "(on)" : ""}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
                <div>
                  <Select value={filters.project} onValueChange={(value) => handleFilterChange("project", value)}>
                    <SelectTrigger className="border-[var(--fixed-card-border)]">
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {!!projectList && projectList.map((project: Project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger className="border-[var(--fixed-card-border)]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {!!projectTaskStatus && projectTaskStatus.map((status: ProjectTaskStatus) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.name}
                        </SelectItem>
                      ))}

                      {/* <SelectItem value="to-do">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
                    <SelectTrigger className="border-[var(--fixed-card-border)]">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filters.assignee} onValueChange={(value) => handleFilterChange("assignee", value)}>
                    <SelectTrigger className="border-[var(--fixed-card-border)]">
                      <SelectValue placeholder="All Assignees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      {!!projectUsers && projectUsers.map((user: ProjectUser) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filters.taskType} onValueChange={(value) => handleFilterChange("taskType", value)}>
                    <SelectTrigger className="border-[var(--fixed-card-border)]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="bug">
                        <div className="flex items-center">
                          <Bug className="mr-2 h-4 w-4 text-red-500" />
                          Bug
                        </div>
                      </SelectItem>
                      <SelectItem value="feature">
                        <div className="flex items-center">
                          <Lightbulb className="mr-2 h-4 w-4 text-blue-500" />
                          Feature
                        </div>
                      </SelectItem>
                      <SelectItem value="story">
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4 text-purple-500" />
                          Story
                        </div>
                      </SelectItem>
                      <SelectItem value="subtask">
                        <div className="flex items-center">
                          <GitBranch className="mr-2 h-4 w-4 text-gray-500" />
                          Subtask
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="w-full border-[var(--fixed-card-border)]"
                    onClick={() => {
                      setFilters({
                        search: "",
                        project: "all",
                        status: "all",
                        priority: "all",
                        assignee: "all",
                        taskType: "all",
                      })
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </>
      }
      <CreateTaskDialog
        open={isCreateDialogOpen}
        projectList={projectList}
        onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
