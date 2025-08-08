"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KanbanFilterRequest } from "@/types/kanban"
import { Project, ProjectTaskStatus, ProjectUser } from "@/types/project"
import { FilterIcon, Search, SearchIcon, X, XIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useLanguage } from "@/lib/i18n/context"
import { getAllProjectTaskStatusHelper, getProjectUsersHelper } from "@/lib/service/api-helpers"
import { Label } from "../ui/label"
import { ProjectTaskType } from "@/types/task"


interface KanbanFiltersProps {
  filters: KanbanFilterRequest
  setFilters: (filters: KanbanFilterRequest) => void
  projects: Project[] | []
  loadingFilter?: boolean
  handleChange: (name: string, value: string) => void
  clearFilters: () => void
  fetchData: () => void
}

export function KanbanFilters({
  handleChange,
  filters,
  projects,
  loadingFilter = false,
  setFilters,
  clearFilters,
  fetchData
}: KanbanFiltersProps) {

  const { translations } = useLanguage()
  const [loading, setLoading] = useState(loadingFilter || false);
  const t = translations.backlog.filters
  const taskTypes = [
    { value: ProjectTaskType.BUG, label: t.bug },
    { value: ProjectTaskType.FEATURE, label: t.feature },
    { value: ProjectTaskType.STORY, label: t.story },
    { value: ProjectTaskType.SUBTASK, label: t.subtask },
  ]

  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | null>([])

  const fetchProjectUsers = useCallback(async (projectId: string) => {
    setProjectUsers(null);
    const usersData = await getProjectUsersHelper(projectId, { setLoading });
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
        fetchProjectUsers(value);
      }
    }
  }

  const clearInputs = () => {
    clearFilters();
    setProjectUsers([]);
  }


  return (
    <div className="p-4 border-b">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search-input" className="text-sm font-medium">
              Search Task No or Title
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                disabled={loading}
                id="search-input"
                type="text"
                placeholder="Search by task number or title..."
                className="pl-8"
                value={filters.searchText}
                onChange={(e) => handleFilterChange("searchText", e.target.value)}
              />
            </div>
          </div>

          {/* Project Combobox */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Project</Label>
            <Select
              disabled={loading}
              value={filters.projectId}
              onValueChange={(value) => handleFilterChange("projectId", value)}>
              <SelectTrigger className="border-[var(--fixed-card-border)]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project: Project) => (
                  <SelectItem key={project.id} value={project.id || ""}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee Combobox */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Assignee</Label>
            <Select
              disabled={loading}
              value={filters.assigneeId}
              onValueChange={(value) => handleFilterChange("assigneeId", value)}>
              <SelectTrigger className="border-[var(--fixed-card-border)]">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {projectUsers?.map((user: ProjectUser) => (
                  <SelectItem key={user.id} value={user.userId || ""}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Type Combobox */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Task Type</Label>

            <Select
              disabled={loading}
              value={filters.taskType}
              onValueChange={(value) => handleFilterChange("taskType", value)}>
              <SelectTrigger className="border-[var(--fixed-card-border)]">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Task Types</SelectItem>
                {taskTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Button
              className="w-full lg:mt-8 h-9 border-[var(--fixed-card-border)]"
              onClick={() => {
                fetchData();
              }}
              disabled={loading}
            >
              Search
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <Button
              variant="outline"
              className="w-full lg:mt-8 h-9 border-[var(--fixed-card-border)]"
              onClick={() => {
                clearInputs();
              }}
              disabled={loading}
            >
              Clear Filters
              <X className="ml-2 MT- h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

        </div>
      </div>
    </div>
  )
}
