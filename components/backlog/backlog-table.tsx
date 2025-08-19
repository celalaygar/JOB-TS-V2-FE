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
import { ProjectTask, ProjectTaskFilterRequest, ProjectTaskPriority, ProjectTaskType, Task, TaskResponse } from "@/types/task"
import { Project } from "@/types/project"
import { BacklogFilterRequest } from "@/types/backlog"
import { useState } from "react"
import { EditTaskDialog } from "../tasks/edit-task-dialog"
import { getTaskTypeBadgeColor, getTaskTypeIcon, getTaskTypeIconClassName } from "@/lib/utils/task-type-utils"
import { getPriorityClassName } from "@/lib/utils/priority-utils"

interface BacklogTableProps {
  filters: BacklogFilterRequest
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
  const projects = useSelector((state: RootState) => state.projects.projects)
  const { translations } = useLanguage()
  const [selecteddTask, setSelecteddTask] = useState<ProjectTask | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const t = translations.backlog.table


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
                <TableHead className="w-[100px] bg-white">{t.taskType}</TableHead>
                <TableHead className="w-[150px] bg-white">{t.assignee}</TableHead>
                <TableHead className="w-[150px] bg-white">{t.project}</TableHead>
                <TableHead className="w-[80px] text-right bg-white">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskResponse?.content && taskResponse.content.length > 0 && taskResponse.content.map((task: ProjectTask) => {
                // Bileşen değişkenlerini tanımlayın
                const IconComponent = getTaskTypeIcon(task.taskType);
                const iconClassName = getTaskTypeIconClassName(task.taskType);

                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {/* 🌟 Bileşeni direkt olarak kullanın ve prop'ları iletin */}
                        <IconComponent className={`h-4 w-4 ${iconClassName}`} />
                        <span>{task.taskNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityClassName(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTaskTypeBadgeColor(task.taskType)} text-white`}>
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
                          <DropdownMenuItem
                            className="flex items-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelecteddTask(task)
                              setEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t.edit}
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
      {selecteddTask &&
        <EditTaskDialog
          projectTask={selecteddTask}
          projectList={projectList}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          fetchData={fetchData}
        />
      }
    </div>
  )
}
