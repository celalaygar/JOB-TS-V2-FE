"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskComment } from "@/components/tasks/task-comment"
import { TaskAttachments } from "@/components/tasks/task-attachments"
import { TaskActivity } from "@/components/tasks/task-activity"
import { Bug, Lightbulb, BookOpen, GitBranch, LinkIcon, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskType } from "@/types/task"

interface TaskDetailsDialogProps {
  taskId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsDialog({ taskId, open, onOpenChange }: TaskDetailsDialogProps) {
  const task = useSelector((state: RootState) => state.tasks.tasks.find((t) => t.id === taskId))
  const projects = useSelector((state: RootState) => state.projects.projects)
  const [activeTab, setActiveTab] = useState<"details" | "comments" | "activity">("details")
  const [linkCopied, setLinkCopied] = useState(false)

  if (!task) return null

  const project = projects.find((p) => p.id === task.project)

  const getTaskTypeIcon = (taskType: TaskType) => {
    switch (taskType) {
      case "bug":
        return <Bug className="h-5 w-5 text-red-500" />
      case "feature":
        return <Lightbulb className="h-5 w-5 text-blue-500" />
      case "story":
        return <BookOpen className="h-5 w-5 text-purple-500" />
      case "subtask":
        return <GitBranch className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/tasks/${task.id}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-xs">
              {task.taskNumber}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-auto"
              onClick={copyLink}
              title="Copy link to task"
            >
              {linkCopied ? <Copy className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
            </Button>
          </div>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {getTaskTypeIcon(task.taskType)}
            {task.title}
          </DialogTitle>
          <DialogDescription>Created on {new Date(task.createdAt).toLocaleDateString()}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-2">
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 border-b">
                <button
                  onClick={() => setActiveTab("details")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all",
                    "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    activeTab === "details" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
                  )}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all",
                    "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    activeTab === "comments" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
                  )}
                >
                  Comments ({task.comments?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all",
                    "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    activeTab === "activity" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
                  )}
                >
                  Activity
                </button>
              </div>
            </div>

            <div className="mt-4">
              {activeTab === "details" && (
                <div>
                  <div className="prose max-w-none">
                    <p>{task.description}</p>
                  </div>
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Attachments</h3>
                      <TaskAttachments attachments={task.attachments} />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div>
                  {task.comments && task.comments.length > 0 ? (
                    <div className="space-y-4">
                      {task.comments.map((comment) => (
                        <TaskComment key={comment.id} comment={comment} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No comments yet.</p>
                  )}
                  <div className="mt-4">
                    <textarea className="w-full p-2 border rounded-md" placeholder="Add a comment..." rows={3} />
                    <Button className="mt-2">Add Comment</Button>
                  </div>
                </div>
              )}

              {activeTab === "activity" && <TaskActivity task={task} activities={task.activities || []} />}
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Status</p>
                  <Badge
                    className={
                      task.status === "to-do"
                        ? "bg-secondary text-secondary-foreground"
                        : task.status === "in-progress"
                          ? "bg-primary text-white"
                          : task.status === "review"
                            ? "bg-warning text-white"
                            : "bg-success text-white"
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
                <div>
                  <p className="text-sm font-medium mb-1">Priority</p>
                  <Badge
                    className={
                      task.priority === "High"
                        ? "bg-destructive text-white"
                        : task.priority === "Medium"
                          ? "bg-warning text-white"
                          : "bg-secondary text-secondary-foreground"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Assignee</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span>{task.assignee.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Project</p>
                  <span>{project?.name || task.projectName}</span>
                </div>
                {task.sprint && (
                  <div>
                    <p className="text-sm font-medium mb-1">Sprint</p>
                    <span>{task.sprint === "backlog" ? "Backlog" : task.sprint}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <p className="text-sm font-medium mb-1">Due Date</p>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                {task.estimatedTime && (
                  <div>
                    <p className="text-sm font-medium mb-1">Estimated Time</p>
                    <span>{task.estimatedTime} hours</span>
                  </div>
                )}
                {task.timeSpent && (
                  <div>
                    <p className="text-sm font-medium mb-1">Time Spent</p>
                    <span>{task.timeSpent} hours</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
