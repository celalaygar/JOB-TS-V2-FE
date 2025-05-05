"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { History, CheckCircle2, AlertCircle, Clock, FileText } from "lucide-react"

interface IssueActivityProps {
  activityItems: {
    id: string
    text: string
    author: {
      id: string
      name: string
      avatar: string
      initials: string
    }
    createdAt: string
    isActivity: boolean
  }[]
  issue: {
    id: string
    title: string
    description: string
    status: string
    priority: string
    project: string
    projectName: string
    assignee: {
      id: string
      name: string
      avatar: string
      initials: string
    }
    sprint?: string
    createdAt: string
  }
  users: {
    id: string
    name: string
    avatar: string
    initials: string
  }[]
}

export function IssueActivity({ activityItems, issue, users }: IssueActivityProps) {
  // Add issue creation as the first activity item
  const allActivities = [
    {
      id: "activity-creation",
      text: `Created this issue`,
      author: {
        id: issue.assignee.id,
        name: issue.assignee.name,
        avatar: issue.assignee.avatar,
        initials: issue.assignee.initials,
      },
      createdAt: issue.createdAt,
      isActivity: true,
    },
    ...activityItems,
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "to-do":
        return <AlertCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "review":
        return <FileText className="h-4 w-4" />
      case "done":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Format status for display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "to-do":
        return "To Do"
      case "in-progress":
        return "In Progress"
      case "review":
        return "In Review"
      case "done":
        return "Done"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {allActivities.length > 0 ? (
        <div className="relative border-l-2 border-[var(--fixed-card-border)] pl-6 ml-3 space-y-6">
          {allActivities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[29px] bg-[var(--fixed-card-bg)] p-1 rounded-full border-2 border-[var(--fixed-card-border)]">
                <History className="h-4 w-4 text-[var(--fixed-primary)]" />
              </div>

              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.author.avatar} alt={activity.author.name} />
                  <AvatarFallback>{activity.author.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.author.name}</span>
                    <span className="text-xs text-[var(--fixed-sidebar-muted)]">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="text-sm mt-1">
                    {activity.text}

                    {/* Show status badge for status changes */}
                    {activity.text.includes("status") && (
                      <Badge
                        className={`ml-2 ${
                          issue.status === "to-do"
                            ? "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                            : issue.status === "in-progress"
                              ? "bg-[var(--fixed-primary)] text-white"
                              : issue.status === "review"
                                ? "bg-[var(--fixed-warning)] text-white"
                                : "bg-[var(--fixed-success)] text-white"
                        }`}
                      >
                        {getStatusIcon(issue.status)}
                        <span className="ml-1">{getStatusDisplay(issue.status)}</span>
                      </Badge>
                    )}

                    {/* Show priority badge for priority changes */}
                    {activity.text.includes("priority") && (
                      <Badge
                        className={`ml-2 ${
                          issue.priority === "High"
                            ? "bg-[var(--fixed-danger)] text-white"
                            : issue.priority === "Medium"
                              ? "bg-[var(--fixed-warning)] text-white"
                              : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                        }`}
                      >
                        {issue.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-[var(--fixed-sidebar-muted)]">No activity recorded yet.</p>
        </div>
      )}
    </div>
  )
}
