"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bug, Lightbulb, BookOpen, GitBranch, MoreHorizontal, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BacklogTableProps {
  filters: {
    search: string
    project: string
    priority: string
    assignee: string
    taskType: string
  }
}

export function BacklogTable({ filters }: BacklogTableProps) {
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const { translations } = useLanguage()
  const t = translations.backlog.table

  // Filter tasks based on filters
  const filteredTasks = tasks.filter((task) => {
    // Filter by search term
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.taskNumber.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    // Filter by project
    if (filters.project !== "all" && task.project !== filters.project) {
      return false
    }

    // Filter by priority
    if (filters.priority !== "all" && task.priority !== filters.priority) {
      return false
    }

    // Filter by assignee
    if (filters.assignee !== "all" && task.assignee.id !== filters.assignee) {
      return false
    }

    // Filter by task type
    if (filters.taskType !== "all" && task.taskType !== filters.taskType) {
      return false
    }

    return true
  })

  // Get task type icon
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="h-4 w-4 text-red-500" />
      case "feature":
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "story":
        return <BookOpen className="h-4 w-4 text-purple-500" />
      case "subtask":
        return <GitBranch className="h-4 w-4 text-gray-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
    }
  }

  // Get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">{t.noTasks}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t.noTasksDescription}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">{t.taskNumber}</TableHead>
            <TableHead>{t.title}</TableHead>
            <TableHead className="w-[100px]">{t.priority}</TableHead>
            <TableHead className="w-[100px]">{t.status}</TableHead>
            <TableHead className="w-[150px]">{t.assignee}</TableHead>
            <TableHead className="w-[150px]">{t.project}</TableHead>
            <TableHead className="w-[80px] text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => {
            const project = projects.find((p) => p.id === task.project)
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
                  <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell className="capitalize">{task.status.replace("-", " ")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[100px]">{task.assignee.name}</span>
                  </div>
                </TableCell>
                <TableCell>{project?.name || "-"}</TableCell>
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
    </div>
  )
}
