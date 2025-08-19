"use client"

import { Badge } from "@/components/ui/badge"
import { Bug, BookOpen, GitBranch, Lightbulb } from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectTaskPriority, ProjectTaskType, type ProjectTask, type Task } from "@/types/task"
import { Project } from "@/types/project"
import { getPriorityClassName } from "@/lib/utils/priority-utils"
import { getTaskTypeIcon, getTaskTypeIconClassName } from "@/lib/utils/task-type-utils"

interface TaskDetailInfoProps {
  task: ProjectTask
  project: Project | null
}

export function TaskDetailInfo({ task, project }: TaskDetailInfoProps) {
  const IconComponent = getTaskTypeIcon(task.taskType);
  const iconClassName = getTaskTypeIconClassName(task.taskType);

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
            {IconComponent && <IconComponent className={`h-4 w-4 ${iconClassName}`} />}
            <span className="capitalize">{task.taskType}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
          <div>
            <Badge
              className={getPriorityClassName(task.priority)}
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
