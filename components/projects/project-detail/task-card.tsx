"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task, TaskType } from "@/types/task"
import {
  Bug,
  Calendar,
  Clock,
  Edit,
  FileText,
  GitBranch,
  Lightbulb,
  BookOpen,
  MoreHorizontal,
  Trash2,
} from "lucide-react"

interface TaskCardProps {
  task: Task
  onEditClick: (task: Task) => void
  onDeleteClick: (task: Task) => void
}

export function TaskCard({ task, onEditClick, onDeleteClick }: TaskCardProps) {
  // Helper function to get task type icon
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditClick(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteClick(task)} className="text-red-500 focus:text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardDescription>{task.description}</CardDescription>
        <div className="flex items-center gap-2">
          {getTaskTypeIcon(task.taskType)}
          <Badge variant="secondary">{task.taskType}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{task.dueDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>{task.status}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{task.priority}</span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
            <AvatarFallback>{task.assignee.initials}</AvatarFallback>
          </Avatar>
          <span>{task.assignee.name}</span>
        </div>
      </CardContent>
    </Card>
  )
}
