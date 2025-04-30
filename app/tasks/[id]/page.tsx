"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskDetailHeader } from "@/components/tasks/task-detail/task-detail-header"
import { TaskDetailTabs } from "@/components/tasks/task-detail/task-detail-tabs"
import { TaskDetailInfo } from "@/components/tasks/task-detail/task-detail-info"
import { TaskDetailDescription } from "@/components/tasks/task-detail/task-detail-description"
import { TaskRelatedTasks } from "@/components/tasks/task-detail/task-related-tasks"
import { TaskCommentSection } from "@/components/tasks/task-detail/task-comment-section"
import { TaskAttachments } from "@/components/tasks/task-attachments"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { tasks } from "@/data/tasks"
import { projects } from "@/data/projects"
import { users } from "@/data/users"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  const [activeTab, setActiveTab] = useState("details")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createSubtaskDialogOpen, setCreateSubtaskDialogOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<string | null>(null)

  const task = tasks.find((t) => t.id === taskId)
  const project = projects.find((p) => p.id === task?.project)

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

  const handleEditTask = (id: string) => {
    setTaskToEdit(id)
    setEditDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <TaskDetailHeader
        taskId={taskId}
        title={task.title}
        taskNumber={task.taskNumber}
        onEdit={() => handleEditTask(taskId)}
        onCreateSubtask={() => setCreateSubtaskDialogOpen(true)}
      />

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
              currentUser={users.find((u) => u.id === "user-1")}
            />
          )}

          {activeTab === "attachments" && <TaskAttachments taskId={taskId} />}

          {activeTab === "related" && (
            <TaskRelatedTasks
              taskId={taskId}
              onCreateSubtask={() => setCreateSubtaskDialogOpen(true)}
              onEditTask={handleEditTask}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <EditTaskDialog taskId={taskToEdit || taskId} open={editDialogOpen} onOpenChange={setEditDialogOpen} />

      {/* Create Subtask Dialog */}
      <CreateTaskDialog
        open={createSubtaskDialogOpen}
        onOpenChange={setCreateSubtaskDialogOpen}
        parentTaskId={taskId}
      />
    </div>
  )
}
