"use client"

import type React from "react"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

interface BoardHeaderProps {
  filters: {
    search: string
    project: string
    priority: string
    assignee: string
    taskType: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      search: string
      project: string
      priority: string
      assignee: string
      taskType: string
    }>
  >
}

export function BoardHeader({ filters, setFilters }: BoardHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Board</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <Select value={filters.project} onValueChange={(value) => setFilters({ ...filters, project: value })}>
          <SelectTrigger>
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

        <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.assignee} onValueChange={(value) => setFilters({ ...filters, assignee: value })}>
          <SelectTrigger>
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

        <Select value={filters.taskType} onValueChange={(value) => setFilters({ ...filters, taskType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Task Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="story">Story</SelectItem>
            <SelectItem value="subtask">Subtask</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
