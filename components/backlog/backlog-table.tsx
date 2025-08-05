"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bug, Lightbulb, BookOpen, GitBranch, MoreHorizontal, Eye, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProjectTaskFilterRequest, ProjectTaskPriority, ProjectTaskType, Task, TaskResponse } from "@/types/task"
import { Project } from "@/types/project"

interface BacklogTableProps {
  filters: ProjectTaskFilterRequest
  loadingTaskTable: boolean
  projectList: Project[]
  taskResponse: TaskResponse | null
  loading: boolean
  fetchData: () => void

  /*{
    search: string
    project: string
    priority: string
    assignee: string
    taskType: string
  }*/
}

export function BacklogTable({ filters, loadingTaskTable, projectList, taskResponse, loading, fetchData }: BacklogTableProps) {
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const { translations } = useLanguage()
  const t = translations.backlog.table

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case ProjectTaskType.BUG:
        return "bg-red-500"
      case ProjectTaskType.FEATURE:
        return "bg-green-500"
      case ProjectTaskType.STORY:
        return "bg-blue-500"
      case ProjectTaskType.SUBTASK:
        return "bg-purple-500"
      default:
        return "bg-slate-500"
    }
  }


  // Get task type icon
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case ProjectTaskType.BUG:
        return <Bug className="h-4 w-4 text-red-500" />
      case ProjectTaskType.FEATURE:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case ProjectTaskType.BUG:
        return <BookOpen className="h-4 w-4 text-purple-500" />
      case ProjectTaskType.SUBTASK:
        return <GitBranch className="h-4 w-4 text-gray-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case ProjectTaskPriority.LOW:
        return "bg-slate-500"
      case ProjectTaskPriority.MEDIUM:
        return "bg-blue-500"
      case ProjectTaskPriority.HIGH:
        return "bg-amber-500"
      case ProjectTaskPriority.CRITICAL:
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <div className="rounded-md border">
      {loadingTaskTable ?

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
        :
        taskResponse?.content === null || taskResponse?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">{t.noTasks}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.noTasksDescription}</p>
          </div>
        ) :
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] bg-white">{t.taskNumber}</TableHead>
                <TableHead className="w-[100px] bg-white">{t.title}</TableHead>
                <TableHead className="w-[100px] bg-white">{t.priority}</TableHead>
                {/* <TableHead className="w-[100px] bg-white">{t.status}</TableHead> */}
                <TableHead className="w-[100px] bg-white">{t.taskType}</TableHead>
                <TableHead className="w-[150px] bg-white">{t.assignee}</TableHead>
                <TableHead className="w-[150px] bg-white">{t.project}</TableHead>
                <TableHead className="w-[80px] text-right bg-white">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskResponse?.content && taskResponse.content.length > 0 && taskResponse.content.map((task: Task) => {
                const project = projects.find((p) => p.id === task.createdProject.id)
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getTaskTypeIcon(task.taskType)}
                        <span>{task.taskNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </TableCell>

                    {/* <TableCell className="capitalize">{task.projectTaskStatus.label.replace("-", " ")}</TableCell> */}

                    <TableCell>
                      <Badge className={`${getTypeColor(task.taskType)} text-white`}>
                        {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={"/placeholder.svg"} alt={task.assignee.email} />
                          <AvatarFallback>{task.assignee.email}</AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[100px]">{task.assignee.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.createdProject.name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/tasks/${task.id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>{t.viewDetails}</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/tasks/${task.id}/edit`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>{t.edit}</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
      }
    </div>
  )
}
