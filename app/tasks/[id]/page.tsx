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
import { ArrowLeft, Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { tasks } from "@/data/tasks"
import { projects } from "@/data/projects"
import { users } from "@/data/users"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { getAllProjectsHelper, getProjectTaskByProjectTaskIdkHelper } from "@/lib/service/api-helpers"
import { ProjectTask } from "@/types/task"
import { Project } from "@/types/project"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const taskId = params.id as string
  const [activeTab, setActiveTab] = useState("details")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createSubtaskDialogOpen, setCreateSubtaskDialogOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<string | null>(null)
  const [projectTask, setProjectTask] = useState<ProjectTask | null>(null)
  const [loadingTaskTable, setLoadingTaskTable] = useState(false);
  const [projectList, setProjectList] = useState<Project[] | []>([]);
  const [project, setProject] = useState<Project | null>(null);

  const fetchProjectTaskDetail = useCallback(async () => {
    const response: ProjectTask | null = await getProjectTaskByProjectTaskIdkHelper(taskId, { setLoading });
    if (response) {
      setProjectTask(response);
      setProject(
        response.createdProject
          ? {
            ...response.createdProject,
            description: response.createdProject.description ?? "",
            status: response.createdProject.status ?? "",
            progress: response.createdProject.progress ?? 0,
            issueCount: response.createdProject.issueCount ?? 0,
          }
          : null
      );
    }
  }, [taskId]);

  useEffect(() => {
    fetchProjectTaskDetail();
  }, [fetchProjectTaskDetail])

  const fetchAllProjects = useCallback(async () => {
    const projectsData = await getAllProjectsHelper({ setLoading: setLoadingTaskTable });
    if (projectsData) {
      setProjectList(projectsData);
    } else {
      setProjectList([]);
    }
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects])
  /*
    if (!projectTask) {
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
  */
  const handleEditTask = (id: string) => {
    setTaskToEdit(id)
    setEditDialogOpen(true)
  }

  return loading || !projectTask ? (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </>
  ) : (
    <>
      <div className="container mx-auto py-6 space-y-6">
        {projectTask &&
          <TaskDetailHeader
            projectTask={projectTask}
            onEdit={() => handleEditTask(taskId)}
            onCreateSubtask={() => setCreateSubtaskDialogOpen(true)}
          />
        }
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
                  <TaskDetailDescription
                    description={projectTask.description}
                    acceptanceCriteria={projectTask.acceptanceCriteria || null} />
                </div>
                <div>
                  <TaskDetailInfo task={projectTask} project={project} />
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <TaskCommentSection
                projectId={projectTask.createdProject.id}
                comments={projectTask.comments || []}
                taskId={taskId}
                currentUser={users.find((u) => u.id === "user-1")}
              />
            )}

            {activeTab === "attachments" && <TaskAttachments taskId={taskId} />}

            {activeTab === "related" && (
              <TaskRelatedTasks
                parentTask={projectTask}
                projectList={projectList}
                taskId={taskId}
                onCreateSubtask={() => setCreateSubtaskDialogOpen(true)}
                onEditTask={handleEditTask}
              />
            )}
          </CardContent>
        </Card>

        {/* Edit Task Dialog */}
        <EditTaskDialog
          fetchData={fetchProjectTaskDetail}
          projectList={projectList}
          projectTask={projectTask}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen} />

        {/* Create Subtask Dialog */}
        <CreateTaskDialog
          projectList={projectList}
          open={createSubtaskDialogOpen}
          onOpenChange={setCreateSubtaskDialogOpen}
          parentTask={projectTask}

          fetchData={fetchProjectTaskDetail}
        />
      </div>
    </>
  )
}
