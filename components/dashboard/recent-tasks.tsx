"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, Lightbulb, BookOpen, GitBranch } from "lucide-react"
import type { TaskType } from "@/types/task"

export function RecentTasks() {
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)

  // Sort tasks by creation date (newest first) and take the first 5
  const recentTasks = [...allTasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

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
    <Card className="col-span-1 fixed-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription className="text-[var(--fixed-sidebar-muted)]">
            Latest tasks across all projects
          </CardDescription>
        </div>
        <Link href="/tasks" className="fixed-secondary-button h-9 px-3 py-2 rounded-md text-sm font-medium">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                  <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    {getTaskTypeIcon(task.taskType)}
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                  </div>
                  <p className="text-sm text-[var(--fixed-sidebar-muted)]">
                    {task.projectName} · {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`
                  text-xs py-1 px-2 rounded-full font-medium
                  ${
                    task.priority === "High"
                      ? "bg-[var(--fixed-danger)] text-white"
                      : task.priority === "Medium"
                        ? "bg-[var(--fixed-warning)] text-white"
                        : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                  }
                `}
              >
                {task.priority}
              </span>
            </div>
          ))}

          {recentTasks.length === 0 && (
            <div className="text-center py-6">
              <p className="text-[var(--fixed-sidebar-muted)]">No tasks found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
