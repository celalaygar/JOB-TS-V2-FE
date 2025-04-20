"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, List, PlusCircle, Search, SlidersHorizontal } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface IssuesHeaderProps {
  onCreateIssue: () => void
  viewMode: "table" | "board"
  onViewModeChange: (mode: "table" | "board") => void
  filters: {
    search: string
    project: string
    status: string
    priority: string
    assignee: string
  }
  onFilterChange: (key: string, value: string) => void
}

export function IssuesHeader({
  onCreateIssue,
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
}: IssuesHeaderProps) {
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
          <p className="text-[var(--fixed-sidebar-muted)]">Track and manage all issues across your projects.</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className={
                viewMode === "table"
                  ? "bg-[var(--fixed-primary)] text-white rounded-none"
                  : "bg-transparent text-[var(--fixed-sidebar-fg)] rounded-none border-0"
              }
              onClick={() => onViewModeChange("table")}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
            <Button
              variant={viewMode === "board" ? "default" : "ghost"}
              size="sm"
              className={
                viewMode === "board"
                  ? "bg-[var(--fixed-primary)] text-white rounded-none"
                  : "bg-transparent text-[var(--fixed-sidebar-fg)] rounded-none border-0"
              }
              onClick={() => onViewModeChange("board")}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Board
            </Button>
          </div>
          <Button className="bg-[var(--fixed-primary)] text-white" onClick={onCreateIssue}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
          <Input
            type="search"
            placeholder="Search issues..."
            className="w-full pl-8 border-[var(--fixed-card-border)]"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.project} onValueChange={(value) => onFilterChange("project", value)}>
            <SelectTrigger className="w-[130px] border-[var(--fixed-card-border)]">
              <SelectValue placeholder="Project" />
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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">More Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filters</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
                    <SelectTrigger className="w-full border-[var(--fixed-card-border)]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="to-do">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={filters.priority} onValueChange={(value) => onFilterChange("priority", value)}>
                    <SelectTrigger className="w-full border-[var(--fixed-card-border)]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignee</label>
                  <Select value={filters.assignee} onValueChange={(value) => onFilterChange("assignee", value)}>
                    <SelectTrigger className="w-full border-[var(--fixed-card-border)]">
                      <SelectValue placeholder="Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                  onClick={() => {
                    onFilterChange("status", "all")
                    onFilterChange("priority", "all")
                    onFilterChange("assignee", "all")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
