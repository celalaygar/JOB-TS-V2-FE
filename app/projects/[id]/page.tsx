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
import { Loader2 } from "lucide-react"
import { getProjectHelper, getAllProjectsHelper } from "@/lib/service/api-helpers" // Import the new helpers
import { ProjectSentInvitationsTab } from "@/components/projects/project-detail/project-sent-invitations-tab"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"

export default function ProjectDetails() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const projectId = params.id as string

  // Get project from Redux store or fallback to direct data import
  const projectFromStore = useSelector((state: RootState) => state.projects.projects.find((p) => p.id === projectId))

  // Fallback to direct data if not in Redux store (though getProjectHelper will fetch it)
  // This line might become redundant if getProjectHelper is the single source of truth for currentProject 

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
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined); // Initialize as undefined to differentiate from null

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    const projectData = await getProjectHelper(projectId, { setLoading });
    if (projectData) {
      setCurrentProject(projectData);
      dispatch(selectProject(projectData)); // Dispatch the fetched project to Redux store
    }
  }, [projectId, dispatch]);


  useEffect(() => {
    fetchProject();
  }, [fetchProject])


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
  ) : ((!currentProject) ? // Check for currentProject being undefined/null after loading
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

        {activeTab === "users" &&
          <ProjectUsersTab
            inviteDialogOpen={inviteDialogOpen}
            setInviteDialogOpen={setInviteDialogOpen}
            project={currentProject}
            onInviteClick={() => setInviteDialogOpen(true)}
          />}

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

        {activeTab === "sent-invitations" && <ProjectSentInvitationsTab project={currentProject} />}

        <ProjectDialogs
          project={currentProject}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          deleteTaskDialogOpen={deleteTaskDialogOpen}
          setDeleteTaskDialogOpen={setDeleteTaskDialogOpen}
          onDeleteProject={handleDeleteProject}
          onDeleteTask={handleDeleteTask}
        />

        {currentProject && <EditProjectDialog
          fetchData={fetchProject}
          project={currentProject}
          open={editDialogOpen} onOpenChange={setEditDialogOpen} />}
      </div>
    </>
  )
}
