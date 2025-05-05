"use client"

import { Badge } from "@/components/ui/badge"
import { Bug, BookOpen, GitBranch, Lightbulb } from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Task } from "@/types/task"

interface TaskDetailInfoProps {
  task: Task
  project: any
}

export function TaskDetailInfo({ task, project }: TaskDetailInfoProps) {
  const getTaskTypeIcon = () => {
    switch (task.taskType) {
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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
        <div>
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
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Assignee</h3>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
            <AvatarFallback>{task.assignee.initials}</AvatarFallback>
          </Avatar>
          <span>{task.assignee.name}</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Project</h3>
        <div>{project?.name || task.projectName}</div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
        <div className="flex items-center gap-2">
          {getTaskTypeIcon()}
          <span className="capitalize">{task.taskType}</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
        <div>
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
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Sprint</h3>
        <div className="capitalize">{task.sprint || "Not assigned"}</div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
        <div>{format(new Date(task.createdAt), "MMM d, yyyy")}</div>
      </div>
    </div>
  )
}
