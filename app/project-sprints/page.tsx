"use client"

import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { ProjectSprintsHeader } from "@/components/sprints/project-sprints/project-sprints-header"
import { ProjectSprintsList } from "@/components/sprints/project-sprints/project-sprints-list"
import { ProjectSprintsFilters } from "@/components/sprints/project-sprints/project-sprints-filters"
import { CreateSprintDialog } from "@/components/sprints/project-sprints/create-sprint-dialog"
import { EditSprintDialog } from "@/components/sprints/project-sprints/edit-sprint-dialog"
import { DeleteSprintDialog } from "@/components/sprints/project-sprints/delete-sprint-dialog"
import { Pagination } from "@/components/ui/pagination"
import { PROJECT_URL, SPRINT_GET_ALL_URL } from "@/lib/service/BasePath"
import BaseService from "@/lib/service/BaseService"
import { Project } from "@/types/project"
import { httpMethods } from "@/lib/service/HttpService"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Sprint } from "@/types/sprint"
import { setSprints } from "@/lib/redux/features/sprints-slice"

export default function ProjectSprints() {
  // State for dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [sprintToEdit, setSprintToEdit] = useState<string | null>(null)
  const [sprintToDelete, setSprintToDelete] = useState<string | null>(null)
  const [projectList, setProjectList] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [sprintList, setSprintList] = useState<Sprint[]>([]);
  const dispatch = useDispatch()

  // State for filters
  const [filters, setFilters] = useState({
    team: "",
    status: "",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  })

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Get sprints from Redux store
  const sprints = useSelector((state: RootState) => state.sprints.sprints)
  const teams = useSelector((state: RootState) => state.teams?.teams || [])

  // Apply filters
  const filteredSprints = sprints.filter((sprint) => {
    // Filter by team
    // if (filters.team && !sprint.team.some((member) => member.name.includes(filters.team))) {
    //   return false
    // }

    // Filter by status
    if (filters.status && sprint.status !== filters.status) {
      return false
    }

    // Filter by date range
    if (filters.dateRange.from) {
      const sprintStart = new Date(sprint.startDate)
      if (sprintStart < filters.dateRange.from) {
        return false
      }
    }

    if (filters.dateRange.to) {
      const sprintEnd = new Date(sprint.endDate)
      if (sprintEnd > filters.dateRange.to) {
        return false
      }
    }

    return true
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredSprints.length / itemsPerPage)
  const paginatedSprints = filteredSprints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

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

  const getAllSprints = useCallback(async () => {
    setProjectList([])
    setLoading(true)
    try {
      const response = await BaseService.request(SPRINT_GET_ALL_URL, {
        method: httpMethods.GET,
      })
      let list = response as Sprint[];
      setSprintList(list)
      dispatch(setSprints(list))
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Sprint find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Sprint failed:', error)
        toast({
          title: `Sprint find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }, [])


  useEffect(() => {
    getAllProjects()
    getAllSprints()
  }, [getAllProjects, getAllSprints])



  return (
    <div className="space-y-6">
      <ProjectSprintsHeader onCreateSprint={() => setIsCreateDialogOpen(true)} />
      {
        loading ?
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </div>
          :
          <>
            <ProjectSprintsFilters projectList={projectList} filters={filters} onFilterChange={handleFilterChange} teams={teams} />

            <ProjectSprintsList
              sprints={paginatedSprints}
              onEditSprint={(id) => setSprintToEdit(id)}
              onDeleteSprint={(id) => setSprintToDelete(id)}
            />

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}


            {!!projectList && (
              <CreateSprintDialog projectList={projectList} open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
            )}

            {sprintToEdit && (
              <EditSprintDialog
                projectList={projectList}
                sprintId={sprintToEdit}
                open={!!sprintToEdit}
                onOpenChange={(open) => !open && setSprintToEdit(null)}
              />
            )}

            {sprintToDelete && (
              <DeleteSprintDialog
                sprintId={sprintToDelete}
                open={!!sprintToDelete}
                onOpenChange={(open) => !open && setSprintToDelete(null)}
              />
            )}
          </>
      }
    </div>
  )
}
