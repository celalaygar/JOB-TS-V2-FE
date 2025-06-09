"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Eye, Edit, UserPlus, Trash2, Search, Filter, CheckCircle2, FolderInput } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { ViewTaskDialog } from "../../sprint-detail/view-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { AssignTaskToUserDialog } from "../../sprint-detail/assign-task-to-user-dialog"
import { MoveTaskDialog } from "../../sprint-detail/move-task-dialog"
import { DeleteTaskDialog } from "../../sprint-detail/delete-task-dialog"

interface SprintDetailTasksProps {
  sprintId: string
  tasks: Array<{
    id: string
    title: string
    description: string
    taskType: string
    status: string
    priority: string
    assignee?: {
      id: string
      name: string
      avatar?: string
    }
  }>
}

export function SprintDetailTasks({ sprintId, tasks }: SprintDetailTasksProps) {
  const users = useSelector((state: RootState) => state.users.users)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [assignTasksDialogOpen, setAssignTasksDialogOpen] = useState(false)
  const [viewTaskDialogOpen, setViewTaskDialogOpen] = useState(false)
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false)
  const [assignTaskDialogOpen, setAssignTaskDialogOpen] = useState(false)
  const [moveTaskDialogOpen, setMoveTaskDialogOpen] = useState(false)
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (statusFilter !== "all" && task.status !== statusFilter) return false

    // Type filter
    if (typeFilter !== "all" && task.taskType !== typeFilter) return false

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a]
    let bValue: any = b[sortField as keyof typeof b]

    // Handle special case for assignee (get user name)
    if (sortField === "assignee") {
      aValue = a.assignee?.name || ""
      bValue = b.assignee?.name || ""
    }

    if (aValue === undefined) aValue = ""
    if (bValue === undefined) bValue = ""

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })



  const handleViewTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setViewTaskDialogOpen(true)
  }

  const handleEditTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setEditTaskDialogOpen(true)
  }

  const handleAssignTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setAssignTaskDialogOpen(true)
  }

  const handleMoveTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setMoveTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setDeleteTaskDialogOpen(true)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
      case "to-do":
        return "bg-slate-500"
      case "in-progress":
        return "bg-blue-500"
      case "review":
        return "bg-purple-500"
      case "done":
        return "bg-green-500"
      case "blocked":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-slate-500"
      case "medium":
        return "bg-blue-500"
      case "high":
        return "bg-amber-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "bug":
        return "bg-red-500"
      case "feature":
        return "bg-green-500"
      case "task":
        return "bg-blue-500"
      case "improvement":
        return "bg-purple-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Sprint Tasks</CardTitle>
            <Badge variant="outline">{sortedTasks.length} Tasks</Badge>
          </div>
          <CardDescription>Tasks and stories assigned to this sprint</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>
                      {statusFilter === "all" ? "Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>
                      {typeFilter === "all" ? "Type" : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setTypeFilter("all")
                }}
                disabled={searchQuery === "" && statusFilter === "all" && typeFilter === "all"}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="sr-only">Clear filters</span>
              </Button>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-1 px-0 hover:bg-transparent"
                    >
                      Title
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("taskType")}
                      className="flex items-center gap-1 px-0 hover:bg-transparent"
                    >
                      Type
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-1 px-0 hover:bg-transparent"
                    >
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("priority")}
                      className="flex items-center gap-1 px-0 hover:bg-transparent"
                    >
                      Priority
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("assignee")}
                      className="flex items-center gap-1 px-0 hover:bg-transparent"
                    >
                      Assignee
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[70px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((task) => (
                    <TableRow key={task.id} className="group">
                      <TableCell className="font-medium">
                        <Link href={`/tasks/${task.id}`} className="hover:text-primary hover:underline">
                          {task.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeColor(task.taskType)} text-white`}>
                          {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(task.status)} text-white`}>
                          {task.status === "todo"
                            ? "To Do"
                            : task.status === "in-progress"
                              ? "In Progress"
                              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                              <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTask(task.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditTask(task.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAssignTask(task.id)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign to User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMoveTask(task.id)}>
                                <FolderInput className="mr-2 h-4 w-4" />
                                Move
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchQuery !== "" || statusFilter !== "all" || typeFilter !== "all" ? (
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">No tasks match your filters</p>
                          <Button
                            variant="link"
                            className="mt-2"
                            onClick={() => {
                              setSearchQuery("")
                              setStatusFilter("all")
                              setTypeFilter("all")
                            }}
                          >
                            Clear filters
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">No tasks assigned to this sprint yet</p>
                          <Button variant="link" className="mt-2" asChild>
                            <Link href="/tasks/new">Add a task</Link>
                          </Button>
                        </div>
                      )}
                    </TableCell>


                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedTaskId && (
        <>
          <ViewTaskDialog open={viewTaskDialogOpen} onOpenChange={setViewTaskDialogOpen} taskId={selectedTaskId} />

          <EditTaskDialog open={editTaskDialogOpen} onOpenChange={setEditTaskDialogOpen} taskId={selectedTaskId} />

          <AssignTaskToUserDialog
            open={assignTaskDialogOpen}
            onOpenChange={setAssignTaskDialogOpen}
            taskId={selectedTaskId}
            sprintId={sprintId}
          />

          <MoveTaskDialog open={moveTaskDialogOpen} onOpenChange={setMoveTaskDialogOpen} taskId={selectedTaskId} />

          <DeleteTaskDialog
            open={deleteTaskDialogOpen}
            onOpenChange={setDeleteTaskDialogOpen}
            taskId={selectedTaskId}
          />
        </>
      )}
    </>
  )
}
