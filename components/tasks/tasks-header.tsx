"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Plus, Search, Filter, Bug, Lightbulb, BookOpen, GitBranch } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

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

  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
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
                {projects.map((project) => (
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
                <SelectItem value="to-do">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
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
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
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

      <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
