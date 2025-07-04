"use client"

import { Badge } from "@/components/ui/badge"
import { Bug, BookOpen, GitBranch, Lightbulb } from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectTaskPriority, ProjectTaskType, type ProjectTask, type Task } from "@/types/task"
import { Project } from "@/types/project"

interface TaskDetailInfoProps {
  task: ProjectTask
  project: Project | null
}

export function TaskDetailInfo({ task, project }: TaskDetailInfoProps) {
  const getTaskTypeIcon = () => {
    switch (task.taskType) {
      case ProjectTaskType.BUG:
        return <Bug className="h-4 w-4 text-red-500" />
      case ProjectTaskType.FEATURE:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case ProjectTaskType.STORY:
        return <BookOpen className="h-4 w-4 text-purple-500" />
      case ProjectTaskType.SUBTASK:
        return <GitBranch className="h-4 w-4 text-gray-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <div>
            <Badge
              className={
                task.projectTaskStatus ? "bg-[" + task.projectTaskStatus.color + "]" : "bg-[var(--fixed-success)] text-white"}
            >
              {task.projectTaskStatus?.name}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Assignee</h3>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={"/placeholder.svg"} alt={task.assignee.email} />
              <AvatarFallback>{task.assignee.email}</AvatarFallback>
            </Avatar>
            <span>{task.assignee.email}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Project</h3>
          <div>{task?.createdProject?.name}</div>
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
                task.priority === ProjectTaskPriority.HIGH
                  ? "bg-[var(--fixed-danger)] text-white"
                  : task.priority === ProjectTaskPriority.MEDIUM
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
          <div className="capitalize">{"Not assigned"}</div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
          <div>{format(new Date(task.createdAt), "MMM d, yyyy")}</div>
        </div>
      </div>
    </>
  )
}
