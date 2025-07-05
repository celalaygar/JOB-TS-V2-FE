import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProjectTask, Task } from "@/types/task"
import type { User } from "@/types/user"
import { formatDistanceToNow } from "date-fns"
import { Activity, AlertCircle, CheckCircle, Clock, Edit, MessageSquare, Plus } from "lucide-react"

interface TaskActivityProps {
  task: ProjectTask
  users: User[]
}

export function TaskActivity({ task, users }: TaskActivityProps) {
  // Filter comments that are marked as activity
  const activityItems = task.comments?.filter((comment) => comment.isActivity) || []

  // Generate system activity items based on task history
  const systemActivities = [
    {
      id: `activity-created-${task.id}`,
      type: "created",
      user: users.find((u) => u.id === task.createdBy.id),
      date: task.createdAt,
      content: "created this task",
    },
    ...(task.updatedAt !== task.createdAt
      ? [
        {
          id: `activity-updated-${task.id}`,
          type: "updated",
          user: users.find((u) => u.id === task.createdBy.id),
          date: task.updatedAt,
          content: "updated this task",
        },
      ]
      : []),
    ...(task.projectTaskStatus.name === "completed"
      ? [
        {
          id: `activity-completed-${task.id}`,
          type: "completed",
          user: users.find((u) => u.id === task.assignee.id),
          date: task.createdAt || new Date(),
          content: "marked this task as completed",
        },
      ]
      : []),
  ]

  // Combine and sort all activity items by date
  const allActivities = [
    ...systemActivities,
    ...activityItems.map((comment) => ({
      id: comment.id,
      type: comment.type || "comment",
      user: users.find((u) => u.id === comment.userId),
      date: new Date(comment.createdAt),
      content: comment.content,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return <Plus className="h-4 w-4 text-green-500" />
      case "updated":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-gray-500" />
      case "status":
        return <Activity className="h-4 w-4 text-purple-500" />
      case "deadline":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "priority":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Task Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No activity recorded for this task yet.</div>
        ) : (
          <div className="space-y-4">
            {allActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user?.avatar || "/placeholder.svg"} alt={activity.user?.name || "User"} />
                  <AvatarFallback>{activity.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.user?.name || "Unknown User"}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                      {getActivityIcon(activity.type)}
                      {activity.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{activity.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
