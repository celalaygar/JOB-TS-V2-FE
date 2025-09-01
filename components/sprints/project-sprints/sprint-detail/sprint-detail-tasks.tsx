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
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Eye, Edit, UserPlus, Trash2, Search, Filter, CheckCircle2, FolderInput } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { ProjectTask } from "@/types/task"
import { Project } from "@/types/project"
import { useLanguage } from "@/lib/i18n/context"
import { getTaskTypeIcon, getTaskTypeIconClassName } from "@/lib/utils/task-type-utils"
import { getPriorityClassName } from "@/lib/utils/priority-utils"

interface SprintDetailTasksProps {
  fetchData?: () => void
  sprintId: string
  tasks: ProjectTask[] | []
  projectList: Project[]
}

export function SprintDetailTasks({ sprintId, tasks, projectList, fetchData }: SprintDetailTasksProps) {
  const { translations } = useLanguage()
  const t = translations.sprint.tasks

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false)
  const [assignTaskDialogOpen, setAssignTaskDialogOpen] = useState(false)
  const [moveTaskDialogOpen, setMoveTaskDialogOpen] = useState(false)
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null)

  const handleEditTask = (task: ProjectTask) => {
    setSelectedTask(task)
    setEditTaskDialogOpen(true)
  }

  const handleAssignTask = (task: ProjectTask) => {
    setSelectedTask(task)
    setAssignTaskDialogOpen(true)
  }

  const handleMoveTask = (task: ProjectTask) => {
    setSelectedTask(task)
    setMoveTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setDeleteTaskDialogOpen(true)
  }

  const handleSort = (field: string) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{t.title}</CardTitle>
            <Badge variant="outline">{t.taskCount.replace("{count}", String(tasks.length))}</Badge>
          </div>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
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
                    <span>{statusFilter === "all" ? t.status : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  <SelectItem value="todo">{t.todo}</SelectItem>
                  <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                  <SelectItem value="review">{t.review}</SelectItem>
                  <SelectItem value="done">{t.done}</SelectItem>
                  <SelectItem value="blocked">{t.blocked}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{typeFilter === "all" ? t.type : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allTypes}</SelectItem>
                  <SelectItem value="bug">{t.bug}</SelectItem>
                  <SelectItem value="feature">{t.feature}</SelectItem>
                  <SelectItem value="task">{t.task}</SelectItem>
                  <SelectItem value="improvement">{t.improvement}</SelectItem>
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
                <span className="sr-only">{t.clearFilters}</span>
              </Button>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button variant="ghost" onClick={() => handleSort("title")} className="flex items-center  px-0 hover:bg-transparent">
                      {t.title}
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("taskType")} className="flex items-center   px-0 hover:bg-transparent">
                      {t.type}
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("status")} className="flex items-center  px-0 hover:bg-transparent">
                      {t.status}
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("priority")} className="flex items-center  px-0 hover:bg-transparent">
                      Priority
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("assignee")} className="flex items-center  px-0 hover:bg-transparent">
                      Assignee
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[70px]">{t.taskActions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!!tasks && tasks.length > 0 ? (
                  tasks.map((task) => {
                    const IconComponent = getTaskTypeIcon(task.taskType)
                    const iconClassName = getTaskTypeIconClassName(task.taskType)
                    return (
                      <TableRow key={task.id} className="group">
                        <TableCell className="font-medium">
                          <Link href={`/tasks/${task.id}`} className="hover:text-primary hover:underline">{task.title}</Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {IconComponent && <IconComponent className={`h-4 w-4 ${iconClassName}`} />}
                            <span className="capitalize"> {task.taskType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`bg-[${task.projectTaskStatus.color}] text-black`}>
                            {task.projectTaskStatus.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getPriorityClassName(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.assignee ? (
                            <div className="flex items-center ">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={"/placeholder.svg"} alt={task.assignee.email} />
                                <AvatarFallback>{task.assignee.email.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{task.assignee.email}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">{t.unassigned}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">{t.taskActions}</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/tasks/${task?.id}`} className="flex items-center cursor-pointer">
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t.viewDetails}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t.edit}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAssignTask(task)}>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  {t.assignToUser}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleMoveTask(task)}>
                                  <FolderInput className="mr-2 h-4 w-4" />
                                  {t.move}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t.delete}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchQuery !== "" || statusFilter !== "all" || typeFilter !== "all" ? (
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">{t.noTasksFiltered}</p>
                          <Button variant="link" className="mt-2" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setTypeFilter("all") }}>
                            {t.clearFilters}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">{t.noTasksAssigned}</p>
                          <Button variant="link" className="mt-2" asChild>
                            <Link href="/tasks/new">{t.addTask}</Link>
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

      {selectedTask && (
        <EditTaskDialog
          fetchData={fetchData}
          projectList={projectList}
          open={editTaskDialogOpen}
          onOpenChange={setEditTaskDialogOpen}
          projectTask={selectedTask}
        />
      )}



      {/* <ViewTaskDialog open={viewTaskDialogOpen} onOpenChange={setViewTaskDialogOpen} taskId={selectedTaskId} />
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
      /> */}
    </>
  )
}
