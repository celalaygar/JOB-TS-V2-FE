"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Plus, Search, Filter, Bug, Lightbulb, BookOpen, GitBranch, Loader2 } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import {
  getAllProjectTaskStatusHelper,
  getActiveProjectUsersHelper
} from "@/lib/service/api-helpers" // Import helpers
import { Project, ProjectTaskStatus, ProjectUser } from "@/types/project"
import { ProjectTaskFilterRequest, ProjectTaskPriority, ProjectTaskType } from "@/types/task"

interface TasksHeaderProps {
  filters: ProjectTaskFilterRequest
  setFilters: (filters: any) => void
  handleChange: (key: string, value: string) => void
  fetchData: () => void
  projectList: Project[] | []
  loadingTaskTable?: boolean
}


export function TasksHeader({ filters, setFilters, handleChange, fetchData, projectList, loadingTaskTable }: TasksHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const users = useSelector((state: RootState) => state.users.users)

  const [loading, setLoading] = useState(loadingTaskTable || false);
  const [projectTaskStatus, setProjectTaskStatus] = useState<ProjectTaskStatus[]>([])
  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | []>([])



  const fetchAllProjectTaskStatus = useCallback(async (projectId: string) => {
    setProjectTaskStatus([]);
    const statusesData = await getAllProjectTaskStatusHelper(projectId, { setLoading });
    if (statusesData) {
      setProjectTaskStatus(statusesData);
    } else {
      setProjectTaskStatus([]);
    }
  }, []);

  const fetchProjectUsers = useCallback(async (projectId: string) => {
    setProjectUsers([]);
    const usersData = await getActiveProjectUsersHelper(projectId, { setLoading });
    if (usersData) {
      setProjectUsers(usersData);
    } else {
      setProjectUsers([]);
    }
  }, []);



  const handleFilterChange = (key: string, value: string) => {
    handleChange(key, value);

    if (key === "projectId") {
      if (value && value !== "" && value !== "all") {
        fetchAllProjectTaskStatus(value);
        fetchProjectUsers(value);
      } else {
        setProjectTaskStatus([]);
        setProjectUsers([]);
      }
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
            disabled={loading}
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
            {/* Project */}
            <div>
              <Select
                disabled={loading}
                value={filters.projectId}
                onValueChange={(value) => handleFilterChange("projectId", value)}>
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projectList.map((project: Project) => (
                    <SelectItem key={project.id} value={project.id || ""}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task Status */}
            <div>
              <Select
                disabled={loading}
                value={filters.projectTaskStatusId}
                onValueChange={(value) => handleFilterChange("projectTaskStatusId", value)}>
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="Task Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Task Statuses</SelectItem>
                  {projectTaskStatus.map((status: ProjectTaskStatus) => (
                    <SelectItem key={status.id} value={status.id || ""}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <Select
                disabled={loading}
                value={filters.priority}
                onValueChange={(value) => handleFilterChange("priority", value)}>
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value={ProjectTaskPriority.CRITICAL}>CRITICAL</SelectItem>
                  <SelectItem value={ProjectTaskPriority.HIGH}>High</SelectItem>
                  <SelectItem value={ProjectTaskPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={ProjectTaskPriority.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div>
              <Select
                disabled={loading}
                value={filters.assigneeId}
                onValueChange={(value) => handleFilterChange("assigneeId", value)}>
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="All Assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {projectUsers.map((user: ProjectUser) => (
                    <SelectItem key={user.id} value={user.id || ""}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task Type */}
            <div>
              <Select
                disabled={loading}
                value={filters.taskType}
                onValueChange={(value) => handleFilterChange("taskType", value)}>
                <SelectTrigger className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={ProjectTaskType.BUG}>Bug</SelectItem>
                  <SelectItem value={ProjectTaskType.FEATURE}>Feature</SelectItem>
                  <SelectItem value={ProjectTaskType.STORY}>Story</SelectItem>
                  <SelectItem value={ProjectTaskType.SUBTASK}>Subtask</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset */}
            <div>
              <Button
                disabled={loading}
                variant="outline"
                className="w-full border-[var(--fixed-card-border)]"
                onClick={() => {
                  setFilters({
                    search: "",
                    project: "all",
                    taskStatus: "all",
                    priority: "all",
                    projectTaskStatusId: "all",
                    assignee: "all",
                    taskType: "all",
                  });
                  setProjectTaskStatus([]);
                  setProjectUsers([]);
                  handleChange("reset", "reset");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </>


      <CreateTaskDialog
        fetchData={fetchData}
        open={isCreateDialogOpen}
        projectList={projectList}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}

