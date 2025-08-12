"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KanbanFilterRequest } from "@/types/kanban"
import { Project, ProjectUser } from "@/types/project"
import { Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useLanguage } from "@/lib/i18n/context"

import { Label } from "../ui/label"
import { ProjectTaskType } from "@/types/task"
import { Sprint } from "@/types/sprint"


interface KanbanFiltersProps {
  filters: KanbanFilterRequest
  setFilters: (filters: KanbanFilterRequest) => void
  projects: Project[] | []
  loadingFilter?: boolean
  handleChange: (name: string, value: string) => void
  clearFilters: () => void
  fetchData: () => void
  sprintList: Sprint[] | null
  projectUsers?: ProjectUser[] | null
}

export function KanbanFilters({
  handleChange,
  filters,
  projects,
  loadingFilter = false,
  setFilters,
  clearFilters,
  fetchData,
  sprintList,
  projectUsers = []
}: KanbanFiltersProps) {

  const { translations } = useLanguage()
  const t = translations.backlog.filters
  const taskTypes = [
    { value: ProjectTaskType.BUG, label: t.bug },
    { value: ProjectTaskType.FEATURE, label: t.feature },
    { value: ProjectTaskType.STORY, label: t.story },
    { value: ProjectTaskType.SUBTASK, label: t.subtask },
  ]


  const handleFilterChange = (key: string, value: string) => {
    handleChange(key, value);

  }

  const clearInputs = () => {
    clearFilters();
  }


  return (
    <div className="p-4 border-b">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                disabled={loadingFilter}
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
            <Select
              disabled={loadingFilter}
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

          {/* Sprints Combobox */}
          <div className="space-y-2">
            <Select
              disabled={loadingFilter}
              value={filters.sprintId}
              onValueChange={(value) => handleFilterChange("sprintId", value)}>
              <SelectTrigger className="border-[var(--fixed-card-border)]">
                <SelectValue placeholder="All Sprints" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sprints </SelectItem>
                {!!sprintList && sprintList.map((sp: Sprint) => (
                  <SelectItem key={sp.id} value={sp.id}>
                    {sp.name + " - " + sp.sprintStatus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee Combobox */}
          <div className="space-y-2">
            <Select
              disabled={loadingFilter}
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

          <div className="space-y-1">
            <Button
              className="w-full  h-9 border-[var(--fixed-card-border)]"
              onClick={() => {
                fetchData();
              }}
              disabled={loadingFilter}
            >
              Search
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <Button
              variant="outline"
              className="w-full  h-9 border-[var(--fixed-card-border)]"
              onClick={() => {
                clearInputs();
              }}
              disabled={loadingFilter}
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



