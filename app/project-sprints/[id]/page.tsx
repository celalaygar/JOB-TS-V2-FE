"use client"

import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { SprintDetailHeader } from "@/components/sprints/project-sprints/sprint-detail/sprint-detail-header"
import { SprintDetailInfo } from "@/components/sprints/project-sprints/sprint-detail/sprint-detail-info"
import { SprintDetailProgress } from "@/components/sprints/project-sprints/sprint-detail/sprint-detail-progress"
import { SprintDetailTasks } from "@/components/sprints/project-sprints/sprint-detail/sprint-detail-tasks"
import { EditSprintDialog } from "@/components/sprints/project-sprints/edit-sprint-dialog"
import { DeleteSprintDialog } from "@/components/sprints/project-sprints/delete-sprint-dialog"
import { useCallback, useEffect, useState } from "react"
import { tasks as dummyTasks } from "@/data/tasks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Sprint } from "@/types/sprint"
import { Project } from "@/types/project"
import { getSprintHelper, getAllProjectsHelper, getAllSprintTasksHelper } from "@/lib/service/api-helpers" // Import the new helpers
import { ProjectTask } from "@/types/task"
import { setSingleSprint } from "@/lib/redux/features/sprints-slice"


export default function SprintDetailPage() {
  const params = useParams()
  const router = useRouter()
  const sprintId = params.id as string
  const singleSprint = useSelector((state: RootState) => state.sprints.singleSprint)

  const teams = useSelector((state: RootState) => state.teams?.teams || [])
  //const sprintTasks = dummyTasks.filter((task) => task.sprint === sprintId || task.sprint === "current")

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [loading, setLoading] = useState(false);
  const [sprint, setSprint] = useState<Sprint>();
  const [projectList, setProjectList] = useState<Project[] | []>([]);
  const [sprintTasks, setSprintTasks] = useState<ProjectTask[]>([]); // Adjust type as needed

  const dispatch = useDispatch()

  const fetchAllSprintTasks = useCallback(async (projectId: string) => {
    if (!sprintId) {
      setLoading(false);
      return;
    }
    // Assuming you have a function to fetch tasks by sprint ID
    const tasksData = await getAllSprintTasksHelper(sprintId, projectId, { setLoading });
    if (tasksData) {
      setSprintTasks(tasksData);
      console.log("Sprint Tasks:", tasksData); // Debugging line to check fetched tasks
    }
  }, [sprintId]);

  const fetchSprint = useCallback(async () => {
    if (!sprintId) {
      setLoading(false);
      return;
    }
    const sprintData = await getSprintHelper(sprintId, { setLoading });
    if (sprintData) {
      setSprint(sprintData);
      dispatch(setSingleSprint(sprintData));
      fetchAllSprintTasks(sprintData.createdProject.id); // Fetch tasks for the sprint's project
    }
  }, [sprintId]);

  const fetchAllProjects = useCallback(async () => {
    setProjectList([])
    const projectsData = await getAllProjectsHelper({ setLoading });
    if (projectsData) {
      setProjectList(projectsData);
    }
  }, []);

  useEffect(() => {
    fetchSprint();
    fetchAllProjects();
  }, [fetchSprint, fetchAllProjects])




  // Find team for this sprint
  const sprintTeam = sprint?.team?.length
    ? teams.find((team) => sprint.team.some((member) => team.members.some((m) => m.id === member.id)))
    : null

  const updatedSprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))

  return loading ?
    <div className="grid gap-4 py-4">
      <div className="flex items-center justify-center" >
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </div >
    :
    <>
      {sprint ?
        <>
          <div className="container mx-auto p-6 space-y-8">
            <SprintDetailHeader
              sprint={sprint}
              tasks={sprintTasks}
              onEdit={() => setIsEditDialogOpen(true)}
              onDelete={() => setIsDeleteDialogOpen(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <SprintDetailInfo sprint={sprint} team={sprintTeam} /> {/* Add non-null assertion */}
                <SprintDetailTasks
                  sprintId={sprint?.id}
                  tasks={sprintTasks}
                  projectList={projectList} />
              </div>
              <div>
                <SprintDetailProgress sprint={sprint!} tasks={sprintTasks} /> {/* Add non-null assertion */}
              </div>
            </div>

            <EditSprintDialog
              projectList={projectList}
              sprint={sprint}
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen} />

            <DeleteSprintDialog
              sprintId={sprintId}
              open={isDeleteDialogOpen}
              onOpenChange={(open) => {
                setIsDeleteDialogOpen(open)
                // If dialog was closed and sprint was deleted, navigate back to sprints list
                if (!open && !updatedSprint) { router.push("/project-sprints") }
              }}
            />
          </div>
        </> :
        <>
          <div className="container mx-auto p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Sprint not found. It may have been deleted or you don't have access to it.
              </AlertDescription>
            </Alert>
          </div>
        </>
      }
    </>
}
