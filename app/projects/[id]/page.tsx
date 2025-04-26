"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { selectProject, removeProject } from "@/lib/redux/features/projects-slice"
import { removeTask } from "@/lib/redux/features/tasks-slice"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { ProjectHeader } from "@/components/projects/project-detail/project-header"
import { ProjectTabNavigation } from "@/components/projects/project-detail/project-tab-navigation"
import { ProjectOverviewTab } from "@/components/projects/project-detail/project-overview-tab"
import { ProjectTasksTab } from "@/components/projects/project-detail/project-tasks-tab"
import { ProjectTeamTab } from "@/components/projects/project-detail/project-team-tab"
import { ProjectRolesTab } from "@/components/projects/project-detail/project-roles-tab"
import { ProjectDialogs } from "@/components/projects/project-detail/project-dialogs"
import type { Task } from "@/types/task"

export default function ProjectDetails() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const projectId = params.id as string

  const project = useSelector((state: RootState) => state.projects.projects.find((p) => p.id === projectId))
  const allTasks = useSelector((state: RootState) => state.tasks?.tasks || [])
  const tasks = allTasks.filter((task) => task.project === projectId)

  const [activeTab, setActiveTab] = useState("overview")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  useEffect(() => {
    if (projectId) {
      dispatch(selectProject(projectId))
    }
  }, [projectId, dispatch])

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  // Handle project deletion
  const handleDeleteProject = () => {
    dispatch(removeProject(projectId))
    router.push("/projects")
  }

  // Handle task deletion
  const handleDeleteTask = () => {
    if (selectedTask) {
      dispatch(removeTask(selectedTask.id))
      setDeleteTaskDialogOpen(false)
      setSelectedTask(null)
    }
  }

  // Handle edit task click
  const handleEditTaskClick = (task: Task) => {
    setSelectedTask(task)
    // Implement edit task dialog logic here
  }

  // Handle delete task click
  const handleDeleteTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDeleteTaskDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        onEditClick={() => setEditDialogOpen(true)}
        onInviteClick={() => setInviteDialogOpen(true)}
        onDeleteClick={() => setDeleteDialogOpen(true)}
        onManageRolesClick={() => setActiveTab("roles")}
      />

      <ProjectTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && <ProjectOverviewTab project={project} tasks={tasks} />}

      {activeTab === "tasks" && (
        <ProjectTasksTab
          project={project}
          tasks={tasks}
          onCreateTaskClick={() => setCreateTaskDialogOpen(true)}
          onEditTaskClick={handleEditTaskClick}
          onDeleteTaskClick={handleDeleteTaskClick}
        />
      )}

      {activeTab === "team" && <ProjectTeamTab project={project} onInviteClick={() => setInviteDialogOpen(true)} />}

      {activeTab === "roles" && <ProjectRolesTab projectId={projectId} />}

      <ProjectDialogs
        project={project}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        createTaskDialogOpen={createTaskDialogOpen}
        setCreateTaskDialogOpen={setCreateTaskDialogOpen}
        deleteTaskDialogOpen={deleteTaskDialogOpen}
        setDeleteTaskDialogOpen={setDeleteTaskDialogOpen}
        inviteDialogOpen={inviteDialogOpen}
        setInviteDialogOpen={setInviteDialogOpen}
        selectedTask={selectedTask}
        onDeleteProject={handleDeleteProject}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}
