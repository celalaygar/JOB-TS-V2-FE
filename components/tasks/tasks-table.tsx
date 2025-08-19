"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateTask } from "@/lib/redux/features/tasks-slice"
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
  Loader2,
} from "lucide-react"
import { type ProjectTask, type ProjectTaskFilterRequest, type Task, type TaskResponse } from "@/types/task"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditTaskDialog } from "./edit-task-dialog"
import { Project } from "@/types/project"
import { getPriorityClassName } from "@/lib/utils/priority-utils"
import { getTaskTypeIcon, getTaskTypeIconClassName } from "@/lib/utils/task-type-utils"

interface TasksTableProps {
  filters: ProjectTaskFilterRequest
  taskResponse: TaskResponse | null
  loading: boolean
  projectList?: Project[] | []
  loadingTaskTable?: boolean
  fetchData?: () => void
}

type SortField = "title" | "status" | "priority" | "project" | "assignee" | "taskType"
type SortDirection = "asc" | "desc"

export function TasksTable({ filters, taskResponse, loading, projectList, loadingTaskTable, fetchData }: TasksTableProps) {
  const dispatch = useDispatch()
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const router = useRouter()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selecteddTask, setSelecteddTask] = useState<ProjectTask | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const [sortField, setSortField] = useState<SortField>("title")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Calculate pagination
  const totalItems = taskResponse?.totalElements
  let totalPages: number;
  if (!!totalItems && !!taskResponse) {
    totalPages = Math.ceil(totalItems / taskResponse?.size)
  }
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

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


  return loading || loadingTaskTable ?
    <div className="grid gap-4 py-4">
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </div>
    :
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
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Parent Task
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
            {!!allTasks && (allTasks as ProjectTask[]).map((task: ProjectTask) => {
              const IconComponent = getTaskTypeIcon(task.taskType);
              const iconClassName = getTaskTypeIconClassName(task.taskType);
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
                      <span className="capitalize">{task.parentTask ?
                        task.parentTask.title
                        :
                        "No Parent Task"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {IconComponent && <IconComponent className={`h-4 w-4 ${iconClassName}`} />}
                      <span className="capitalize">{task.taskType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        task.projectTaskStatus?.color ?
                          "bg-[" + task.projectTaskStatus.color + "] text-black"
                          :
                          "bg-[var(--fixed-secondary)] text-black"
                      }
                    >
                      {task.projectTaskStatus?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getPriorityClassName(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.createdProject?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={task.assignee?.avatar || "/placeholder.svg"}
                          alt={task.assignee?.firstname + " " + task.assignee?.lastname} />
                        <AvatarFallback>{task.assignee?.email}</AvatarFallback>
                      </Avatar>
                      <span>{task.assignee?.email}</span>
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
                        <DropdownMenuItem
                          // href={`/tasks/${task.id}/edit`} 
                          className="flex items-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelecteddTask(task)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
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

            {allTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div >
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

      {selecteddTask &&
        <EditTaskDialog
          projectTask={selecteddTask}
          projectList={projectList}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          fetchData={fetchData}
        />
      }

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
}
