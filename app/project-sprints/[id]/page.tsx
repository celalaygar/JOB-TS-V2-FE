"use client"

import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
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
import BaseService from "@/lib/service/BaseService"
import { PROJECT_URL, SPRINT_GET_ALL_URL, SPRINT_URL } from "@/lib/service/BasePath"
import { httpMethods } from "@/lib/service/HttpService"
import { Sprint } from "@/types/sprint"
import { Project } from "@/types/project"

export default function SprintDetailPage() {
  const params = useParams()
  const router = useRouter()
  const sprintId = params.id as string

  const teams = useSelector((state: RootState) => state.teams?.teams || [])
  const sprintTasks = dummyTasks.filter((task) => task.sprint === sprintId || task.sprint === "current")

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [loading, setLoading] = useState(false);
  const [sprint, setSprint] = useState<Sprint>();
  const [projectList, setProjectList] = useState<Project[] | []>([]);

  console.log("response sprint")


  const getSprint = useCallback(async () => {

    console.log("response getSprint " + sprintId)
    if (!sprintId) {
      return;
    }
    setLoading(true);
    try {
      const response: Sprint = await BaseService.request(`${SPRINT_URL}/${sprintId}`, {
        method: httpMethods.GET,
      });
      toast({
        title: "Sprint Updated",
        description: `Sprint "${response.name}" has been successfully updated.`,
      });
      setSprint(response)
      console.log("response sprint")
      console.log(response)
    } catch (error: any) {
      console.error("Failed to update sprint:", error);
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating the sprint.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sprintId])

  const getAllProjects = useCallback(async () => {
    setProjectList([])
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_URL, {
        method: httpMethods.GET,
      })
      let projectList = response as Project[];
      setProjectList(projectList)
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
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
    getSprint()
    getAllProjects()
  }, [getSprint, getAllProjects])

  // Find team for this sprint
  const sprintTeam = sprint?.team?.length
    ? teams.find((team) => sprint.team.some((member) => team.members.some((m) => m.id === member.id)))
    : null

  const updatedSprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))

  if (!sprint) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Sprint not found. It may have been deleted or you don't have access to it. xx
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return loading ?
    <div className="grid gap-4 py-4">
      <div className="flex items-center justify-center" >
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </div >
    :
    <>
      <div className="container mx-auto p-6 space-y-8">
        {sprint && <SprintDetailHeader
          sprint={sprint}
          tasks={sprintTasks}
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <SprintDetailInfo sprint={sprint} team={sprintTeam} />
            <SprintDetailTasks sprintId={sprint?.id} tasks={sprintTasks} />
          </div>
          <div>
            <SprintDetailProgress sprint={sprint} tasks={sprintTasks} />
          </div>
        </div>

        {/* Dialogs */}
        <EditSprintDialog projectList={projectList} sprintId={sprintId} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

        <DeleteSprintDialog
          sprintId={sprintId}
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open)
            // If dialog was closed and sprint was deleted, navigate back to sprints list
            if (!open && !updatedSprint) {
              router.push("/project-sprints")
            }
          }}
        />
      </div>
    </>
}