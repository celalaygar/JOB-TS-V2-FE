"use client"

import { useCallback, useEffect, useState } from "react"
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
import { ProjectUsersTab } from "@/components/projects/project-detail/project-users-tab"
import { ProjectTeamTab } from "@/components/projects/project-detail/project-team-tab"
import { ProjectRolesTab } from "@/components/projects/project-detail/project-roles-tab"
import { ProjectDialogs } from "@/components/projects/project-detail/project-dialogs"
import { ProjectStatusTab } from "@/components/projects/project-detail/project-status-tab"
import type { Task } from "@/types/task"
import { projects } from "@/data/projects" // Import projects directly from data
import { Project } from "@/types/project"
import BaseService from "@/lib/service/BaseService"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { PROJECT_URL } from "@/lib/service/BasePath"
import { httpMethods } from "@/lib/service/HttpService"

export default function ProjectDetails() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const projectId = params.id as string

  // Get project from Redux store or fallback to direct data import
  const projectFromStore = useSelector((state: RootState) => state.projects.projects.find((p) => p.id === projectId))

  // Fallback to direct data if not in Redux store
  const project = projectFromStore || projects.find((p) => p.id === projectId)

  const allTasks = useSelector((state: RootState) => state.tasks?.tasks || [])
  const tasks = allTasks.filter((task) => task.project === projectId)

  const [activeTab, setActiveTab] = useState("overview")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false)


  const [loading, setLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project>();

  const getProject = useCallback(async () => {
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_URL + "/" + projectId, {
        method: httpMethods.GET,
      })
      let data = response as Project;
      setCurrentProject(data)
      console.log('Project find data ', data)
      dispatch(selectProject(data))
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
        console.error(`Project find all failed. (400)`)
      } else {
        console.error('Project failed:', error)
        toast({
          title: `Project find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getProject()
  }, [getProject])


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

  return loading ? (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </>
  ) : ((!currentProject) ?
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    </>
    :
    <>
      <div className="space-y-6">
        <ProjectHeader
          project={currentProject}
          onEditClick={() => setEditDialogOpen(true)}
          onInviteClick={() => setInviteDialogOpen(true)}
          onDeleteClick={() => setDeleteDialogOpen(true)}
          onManageRolesClick={() => setActiveTab("roles")}
        />

        <ProjectTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "overview" && <ProjectOverviewTab project={currentProject} tasks={tasks} />}

        {activeTab === "users" && <ProjectUsersTab project={currentProject} onInviteClick={() => setInviteDialogOpen(true)} />}

        {activeTab === "team" && (
          <ProjectTeamTab
            createTeamDialogOpen={createTeamDialogOpen}
            setCreateTeamDialogOpen={setCreateTeamDialogOpen}
            project={currentProject}
            onInviteClick={() => setInviteDialogOpen(true)}
            onCreateTeamClick={() => setCreateTeamDialogOpen(true)}
          />
        )}

        {activeTab === "roles" && <ProjectRolesTab project={currentProject} projectId={projectId} />}

        {activeTab === "status" && <ProjectStatusTab project={currentProject} projectId={projectId} />}

        <ProjectDialogs
          project={currentProject}
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
    </>
  )
}
