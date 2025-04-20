"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Flag, Tag, User } from "lucide-react"
import type { Task } from "@/types/task"

interface TaskDetailInfoProps {
  task: Task
  project: any
}

export function TaskDetailInfo({ task, project }: TaskDetailInfoProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <h3 className="font-medium mb-4">Task Information</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="capitalize">{task.taskType}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Flag className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
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

          <div className="flex items-start gap-2">
            <Flag className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
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

          <div className="flex items-start gap-2">
            <User className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Assignee</p>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                  <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                </Avatar>
                <span>{task.assignee.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p>{task.dueDate || "No due date"}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Time</p>
              <p>{task.estimatedHours ? `${task.estimatedHours} hours` : "Not estimated"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <h3 className="font-medium mb-4">Project</h3>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-[var(--fixed-primary)] flex items-center justify-center text-white font-medium">
            {project?.name.charAt(0) || "P"}
          </div>
          <div>
            <p>{project?.name || task.projectName}</p>
            <p className="text-sm text-muted-foreground">{project?.key || task.taskNumber.split("-")[0]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
