"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface WeeklyBoardFiltersProps {
  filters: {
    project: string
    user: string
    completed: string
  }
  onFilterChange: (key: string, value: string) => void
}

export function WeeklyBoardFilters({ filters, onFilterChange }: WeeklyBoardFiltersProps) {
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)

  const resetFilters = () => {
    onFilterChange("project", "all")
    onFilterChange("user", "all")
    onFilterChange("completed", "all")
  }

  const hasActiveFilters = filters.project !== "all" || filters.user !== "all" || filters.completed !== "all"

  return (
    <div className="bg-[var(--fixed-secondary)] p-4 rounded-lg border border-[var(--fixed-card-border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
          >
            <X className="h-4 w-4 mr-1" />
            Reset Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project-filter">Project</Label>
          <Select value={filters.project} onValueChange={(value) => onFilterChange("project", value)}>
            <SelectTrigger id="project-filter" className="border-[var(--fixed-card-border)]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-filter">User</Label>
          <Select value={filters.user} onValueChange={(value) => onFilterChange("user", value)}>
            <SelectTrigger id="user-filter" className="border-[var(--fixed-card-border)]">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="completed-filter">Status</Label>
          <Select value={filters.completed} onValueChange={(value) => onFilterChange("completed", value)}>
            <SelectTrigger id="completed-filter" className="border-[var(--fixed-card-border)]">
              <SelectValue placeholder="All Tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
