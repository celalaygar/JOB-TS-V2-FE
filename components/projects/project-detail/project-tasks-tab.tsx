"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Filter, Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import type { Project } from "@/types/project"
import type { Task } from "@/types/task"

interface ProjectTasksTabProps {
  project: Project
  tasks: Task[]
  onCreateTaskClick: () => void
  onEditTaskClick: (task: Task) => void
  onDeleteTaskClick: (task: Task) => void
}

export function ProjectTasksTab({
  project,
  tasks,
  onCreateTaskClick,
  onEditTaskClick,
  onDeleteTaskClick,
}: ProjectTasksTabProps) {
  // Filtering state
  const [taskFilters, setTaskFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignee: "",
    taskType: "",
  })

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (
      taskFilters.search &&
      !task.title.toLowerCase().includes(taskFilters.search.toLowerCase()) &&
      !task.description.toLowerCase().includes(taskFilters.search.toLowerCase())
    ) {
      return false
    }

    // Status filter
    if (taskFilters.status && taskFilters.status !== "all" && task.status !== taskFilters.status) {
      return false
    }

    // Priority filter
    if (taskFilters.priority && taskFilters.priority !== "all" && task.priority !== taskFilters.priority) {
      return false
    }

    // Assignee filter
    if (taskFilters.assignee && taskFilters.assignee !== "all" && task.assignee.id !== taskFilters.assignee) {
      return false
    }

    // Task Type filter
    if (taskFilters.taskType && taskFilters.taskType !== "all" && task.taskType !== taskFilters.taskType) {
      return false
    }

    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight">Tasks</h2>
        <div className="flex items-center gap-2">
          <Button onClick={onCreateTaskClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="px-2 py-1">
                <h4 className="mb-2 text-sm font-medium">Search</h4>
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  value={taskFilters.search}
                  onChange={(e) => setTaskFilters({ ...taskFilters, search: e.target.value })}
                />
              </div>
              <div className="px-2 py-1">
                <h4 className="mb-2 text-sm font-medium">Status</h4>
                <Select
                  value={taskFilters.status}
                  onValueChange={(value) => setTaskFilters({ ...taskFilters, status: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="to-do">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="px-2 py-1">
                <h4 className="mb-2 text-sm font-medium">Priority</h4>
                <Select
                  value={taskFilters.priority}
                  onValueChange={(value) => setTaskFilters({ ...taskFilters, priority: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="px-2 py-1">
                <h4 className="mb-2 text-sm font-medium">Assignee</h4>
                <Select
                  value={taskFilters.assignee}
                  onValueChange={(value) => setTaskFilters({ ...taskFilters, assignee: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {project.team.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="px-2 py-1">
                <h4 className="mb-2 text-sm font-medium">Task Type</h4>
                <Select
                  value={taskFilters.taskType}
                  onValueChange={(value) => setTaskFilters({ ...taskFilters, taskType: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="subtask">Subtask</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onEditClick={onEditTaskClick} onDeleteClick={onDeleteTaskClick} />
        ))}
        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No tasks found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
