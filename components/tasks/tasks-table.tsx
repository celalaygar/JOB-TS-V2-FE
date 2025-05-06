"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateTask, type Task } from "@/lib/redux/features/tasks-slice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Bug,
  Lightbulb,
  BookOpen,
  GitBranch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { TaskType } from "@/types/task"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TasksTableProps {
  filters: {
    search: string
    project: string
    status: string
    priority: string
    assignee: string
    taskType: string
  }
}

type SortField = "title" | "status" | "priority" | "project" | "assignee" | "taskType"
type SortDirection = "asc" | "desc"

export function TasksTable({ filters }: TasksTableProps) {
  const dispatch = useDispatch()
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const router = useRouter()

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const [sortField, setSortField] = useState<SortField>("title")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Apply filters
  const filteredTasks = allTasks.filter((task) => {
    // Search filter
    const matchesSearch =
      filters.search === "" ||
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase())

    // Project filter
    const matchesProject = filters.project === "all" || task.project === filters.project

    // Status filter
    const matchesStatus = filters.status === "all" || task.status === filters.status

    // Priority filter
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority

    // Assignee filter
    const matchesAssignee = filters.assignee === "all" || task.assignee.id === filters.assignee

    // Task Type filter
    const matchesTaskType = filters.taskType === "all" || task.taskType === filters.taskType

    return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee && matchesTaskType
  })

  // Apply sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
      case "priority":
        // Sort by priority (High > Medium > Low)
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        comparison =
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) -
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 0)
        break
      case "project":
        comparison = a.projectName.localeCompare(b.projectName)
        break
      case "assignee":
        comparison = a.assignee.name.localeCompare(b.assignee.name)
        break
      case "taskType":
        comparison = a.taskType.localeCompare(b.taskType)
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Calculate pagination
  const totalItems = sortedTasks.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTasks = sortedTasks.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages
    setCurrentPage(page)
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const handleDeleteTask = () => {
    if (taskToDelete) {
      dispatch(
        updateTask({
          id: taskToDelete,
          changes: { status: "deleted" } as Partial<Task>,
        }),
      )
      setTaskToDelete(null)
    }
  }

  const getTaskTypeIcon = (taskType: TaskType) => {
    switch (taskType) {
      case "bug":
        return <Bug className="h-4 w-4 text-red-500" />
      case "feature":
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "story":
        return <BookOpen className="h-4 w-4 text-purple-500" />
      case "subtask":
        return <GitBranch className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <>
      <div className="rounded-md border border-[var(--fixed-card-border)] overflow-hidden">
        <Table>
          <TableHeader className="bg-[var(--fixed-secondary)]">
            <TableRow>
              <TableHead className="w-[35%]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Title {getSortIcon("title")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("taskType")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Type {getSortIcon("taskType")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Status {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("priority")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Priority {getSortIcon("priority")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("project")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Project {getSortIcon("project")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("assignee")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Assignee {getSortIcon("assignee")}
                </Button>
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.map((task) => {
              const project = projects.find((p) => p.id === task.project)

              return (
                <TableRow
                  key={task.id}
                  className="cursor-pointer hover:bg-[var(--fixed-secondary)]"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {task.taskNumber}
                    </Badge>
                    {task.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTaskTypeIcon(task.taskType)}
                      <span className="capitalize">{task.taskType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        task.status === "to-do"
                          ? "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                          : task.status === "in-progress"
                            ? "bg-[var(--fixed-primary)] text-white"
                            : task.status === "review"
                              ? "bg-[var(--fixed-warning)] text-white"
                              : "bg-[var(--fixed-success)] text-white"
                      }
                    >
                      {task.status === "to-do"
                        ? "To Do"
                        : task.status === "in-progress"
                          ? "In Progress"
                          : task.status === "review"
                            ? "In Review"
                            : "Done"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        task.priority === "High"
                          ? "bg-[var(--fixed-danger)] text-white"
                          : task.priority === "Medium"
                            ? "bg-[var(--fixed-warning)] text-white"
                            : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{project?.name || task.projectName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span>{task.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--fixed-sidebar-fg)]">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/tasks/${task.id}`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/tasks/${task.id}/edit`} className="flex items-center cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[var(--fixed-danger)]"
                          onClick={(e) => {
                            e.stopPropagation()
                            setTaskToDelete(task.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}

            {sortedTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="text-sm text-[var(--fixed-sidebar-muted)]">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} tasks
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center mr-4">
            <span className="text-sm mr-2">Rows per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number.parseInt(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDeleteTask}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
