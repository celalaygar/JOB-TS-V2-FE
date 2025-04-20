"use client"

import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskDetailHeader } from "@/components/tasks/task-detail/task-detail-header"
import { TaskDetailTabs } from "@/components/tasks/task-detail/task-detail-tabs"
import { TaskDetailInfo } from "@/components/tasks/task-detail/task-detail-info"
import { TaskDetailDescription } from "@/components/tasks/task-detail/task-detail-description"
import { TaskRelatedTasks } from "@/components/tasks/task-detail/task-related-tasks"
import { TaskCommentSection } from "@/components/tasks/task-detail/task-comment-section"
import { TaskAttachments } from "@/components/tasks/task-attachments"
import { TaskActivity } from "@/components/tasks/task-activity"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  const [activeTab, setActiveTab] = useState("details")

  const task = useSelector((state: RootState) => state.tasks.tasks.find((t) => t.id === taskId))
  const users = useSelector((state: RootState) => state.users.users)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)

  // Find related tasks (subtasks or parent task)
  const relatedTasks = allTasks.filter(
    (t) =>
      (task?.parentTaskId && t.id === task.parentTaskId) || // Parent task
      t.parentTaskId === taskId, // Subtasks
  )

  const parentTask = task?.parentTaskId ? allTasks.find((t) => t.id === task.parentTaskId) : null

  const project = projects.find((p) => p.id === task?.project)

  // Get activity items (comments marked as activity)
  const activityItems = task?.comments?.filter((comment) => comment.isActivity) || []

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold mb-2">Task not found</h2>
        <p className="text-muted-foreground mb-4">The task you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => router.push("/tasks")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <TaskDetailHeader taskId={taskId} title={task.title} taskNumber={task.taskNumber} />

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>View and manage task information</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TaskDetailDescription description={task.description} acceptanceCriteria={task.acceptanceCriteria} />
              </div>
              <div>
                <TaskDetailInfo task={task} project={project} />
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <TaskCommentSection
              comments={task.comments || []}
              taskId={taskId}
              currentUser={users.find((u) => u.id === "current-user")}
            />
          )}

          {activeTab === "attachments" && <TaskAttachments taskId={taskId} />}

          {activeTab === "activity" && <TaskActivity activityItems={activityItems} task={task} users={users} />}

          {activeTab === "related" && (
            <TaskRelatedTasks taskId={taskId} relatedTasks={relatedTasks} parentTask={parentTask} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
