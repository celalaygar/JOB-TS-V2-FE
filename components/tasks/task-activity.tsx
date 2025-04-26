"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import type { Comment, Task } from "@/types/task"

interface TaskActivityProps {
  activityItems?: Comment[]
  task?: Task
  users?: any[]
  taskId?: string
}

export function TaskActivity({ activityItems, task, users, taskId }: TaskActivityProps) {
  // Handle the case when no props are provided
  if (!activityItems && !task && !taskId) {
    return (
      <div className="text-center py-6">
        <p className="text-[var(--fixed-sidebar-muted)]">No activity data available.</p>
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  // If we have activityItems directly, use those
  let activities = activityItems || []

  // If we don't have activities but have a task, extract activities from the task
  if ((!activities || activities.length === 0) && task) {
    activities = task.comments?.filter((comment) => comment.isActivity) || []
  }

  // Sort activity items by date (newest first)
  const sortedActivity = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Add task creation as the first activity if we have a task
  const allActivity = task
    ? [
        {
          id: "task-created",
          text: `Created this task`,
          author: task.assignee,
          createdAt: task.createdAt,
          isActivity: true,
        },
        ...sortedActivity,
      ]
    : sortedActivity

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Activity History</h3>

      {allActivity.length > 0 ? (
        <div className="space-y-4">
          {allActivity.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.author.avatar || "/placeholder.svg"} alt={activity.author.name} />
                <AvatarFallback>{activity.author.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.author.name}</span>
                  <span className="text-xs text-[var(--fixed-sidebar-muted)]">{formatDate(activity.createdAt)}</span>
                </div>
                <div className="text-sm mt-1">{activity.text}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[var(--fixed-sidebar-muted)]">No activity yet.</p>
        </div>
      )}
    </div>
  )
}
