"use client"

import { useState } from "react"
import { tasks } from "@/data/tasks"
import { users } from "@/data/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, MoreHorizontal, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TaskRelatedTasksProps {
  taskId: string
  onCreateSubtask: () => void
  onEditTask?: (taskId: string) => void
}

export function TaskRelatedTasks({ taskId, onCreateSubtask, onEditTask }: TaskRelatedTasksProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [relatedTab, setRelatedTab] = useState("subtasks")

  // Get the current task
  const currentTask = tasks.find((task) => task.id === taskId)
  if (!currentTask) return null

  // Get subtasks (tasks that have this task as parent)
  const subtasks = tasks.filter((task) => task.parentTaskId === taskId)

  // Get parent task if this is a subtask
  const parentTask = currentTask.parentTaskId ? tasks.find((task) => task.id === currentTask.parentTaskId) : null

  // Get related tasks from the subtasks array if it exists
  const relatedTasksFromArray = currentTask.subtasks
    ? currentTask.subtasks.map((subtaskId) => tasks.find((task) => task.id === subtaskId)).filter(Boolean)
    : []

  // Combine both methods of finding related tasks and remove duplicates
  const allSubtasks = [...subtasks, ...relatedTasksFromArray]
  const uniqueSubtasks = Array.from(new Map(allSubtasks.map((task) => [task?.id, task])).values()).filter(Boolean)

  // Find sibling tasks (tasks that share the same parent)
  const siblingTasks = parentTask
    ? tasks.filter((task) => task.parentTaskId === parentTask.id && task.id !== taskId)
    : []

  // Find related tasks by project
  const projectRelatedTasks = tasks
    .filter(
      (task) =>
        task.project === currentTask.project &&
        task.id !== taskId &&
        !task.parentTaskId &&
        !uniqueSubtasks.some((st) => st?.id === task.id),
    )
    .slice(0, 5) // Limit to 5 tasks for demo purposes

  // Apply filters and search
  const filterAndSearch = (taskList: any[]) => {
    return taskList.filter((task) => {
      // Apply type filter
      if (filterType !== "all" && task?.taskType !== filterType) return false

      // Apply status filter
      if (filterStatus !== "all" && task?.status !== filterStatus) return false

      // Apply search
      if (
        searchQuery &&
        !task?.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task?.taskNumber.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }

  const filteredSubtasks = filterAndSearch(uniqueSubtasks)
  const filteredSiblings = filterAndSearch(siblingTasks)
  const filteredProjectTasks = filterAndSearch(projectRelatedTasks)

  // Determine which tasks to display based on the active tab
  const displayTasks =
    relatedTab === "subtasks" ? filteredSubtasks : relatedTab === "siblings" ? filteredSiblings : filteredProjectTasks

  const handleEditTaskClick = (id: string) => {
    if (onEditTask) {
      onEditTask(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium">Related Tasks</h3>
        <Button size="sm" onClick={onCreateSubtask}>
          <Plus className="h-4 w-4 mr-1" />
          Add Subtask
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b">
          <button
            onClick={() => setRelatedTab("subtasks")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              relatedTab === "subtasks" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Subtasks ({uniqueSubtasks.length})
          </button>
          <button
            onClick={() => setRelatedTab("siblings")}
            disabled={!parentTask}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !parentTask && "opacity-50 cursor-not-allowed",
              relatedTab === "siblings" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Siblings ({siblingTasks.length})
          </button>
          <button
            onClick={() => setRelatedTab("project")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              relatedTab === "project" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Project Tasks
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="subtask">Subtask</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
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
        </div>

        <div className="mt-4">
          {relatedTab === "subtasks" && renderTasksTable(filteredSubtasks, handleEditTaskClick)}

          {relatedTab === "siblings" &&
            (parentTask ? (
              <>
                <Card className="mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Parent Task</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {parentTask.taskNumber}
                        </Badge>
                        <span className="font-medium">{parentTask.title}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditTaskClick(parentTask.id)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/tasks/${parentTask.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p className="line-clamp-2">{parentTask.description}</p>
                    </div>
                  </CardContent>
                </Card>
                {renderTasksTable(filteredSiblings, handleEditTaskClick)}
              </>
            ) : (
              <div className="text-center p-6 border rounded-md">
                <p className="text-muted-foreground">This task is not a subtask of any parent task</p>
              </div>
            ))}

          {relatedTab === "project" && renderTasksTable(filteredProjectTasks, handleEditTaskClick)}
        </div>
      </div>
    </div>
  )
}

function renderTasksTable(tasksList: any[], onEditTask: (taskId: string) => void) {
  if (tasksList.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md">
        <p className="text-muted-foreground mb-2">No tasks found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasksList.map((task) => {
            // Get the assignee data from the users data folder
            const assigneeData = users.find((user) => user.id === task?.assignee?.id) || task?.assignee

            return (
              <TableRow key={task?.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {task?.taskNumber}
                    </Badge>
                    <span className="line-clamp-1">{task?.title}</span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{task?.taskType}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      task?.status === "to-do"
                        ? "bg-secondary text-secondary-foreground"
                        : task?.status === "in-progress"
                          ? "bg-primary text-primary-foreground"
                          : task?.status === "review"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                    }
                  >
                    {task?.status === "to-do"
                      ? "To Do"
                      : task?.status === "in-progress"
                        ? "In Progress"
                        : task?.status === "review"
                          ? "In Review"
                          : "Done"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      task?.priority === "High"
                        ? "bg-red-500 text-white"
                        : task?.priority === "Medium"
                          ? "bg-yellow-500 text-white"
                          : "bg-secondary text-secondary-foreground"
                    }
                  >
                    {task?.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={assigneeData?.avatar || "/placeholder.svg"} alt={assigneeData?.name} />
                      <AvatarFallback>{assigneeData?.initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{assigneeData?.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/tasks/${task?.id}`} className="flex items-center cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditTask(task?.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
