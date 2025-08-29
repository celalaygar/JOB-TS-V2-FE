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
import { Project } from "@/types/project"
import { Loader2 } from "lucide-react"
import { Sprint } from "@/types/sprint"
import { setSprints } from "@/lib/redux/features/sprints-slice"
import { getAllProjectsHelper } from "@/lib/service/api-helpers"
import { getAllSprintsGlobalHelper } from "@/lib/service/helper/sprint-helper"

export default function ProjectSprints() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null)
  const [sprintToDelete, setSprintToDelete] = useState<string | null>(null)
  const [projectList, setProjectList] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const [filters, setFilters] = useState({
    team: "",
    status: "",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const sprints = useSelector((state: RootState) => state.sprints.sprints)
  const teams = useSelector((state: RootState) => state.teams?.teams || [])

  const filteredSprints = sprints.filter((sprint) => {
    if (filters.status && sprint.status !== filters.status) {
      return false
    }

    if (!!filters.dateRange && filters.dateRange.from) {
      const sprintStart = new Date(sprint.startDate)
      if (sprintStart < filters.dateRange.from) {
        return false
      }
    }

    if (!!filters.dateRange && filters.dateRange.to) {
      const sprintEnd = new Date(sprint.endDate)
      if (sprintEnd > filters.dateRange.to) {
        return false
      }
    }

    return true
  })

  const totalPages = Math.ceil(filteredSprints.length / itemsPerPage)
  const paginatedSprints = filteredSprints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const fetchAllProjects = useCallback(async () => {
    setProjectList([]);
    const projectsData = await getAllProjectsHelper({ setLoading });
    if (projectsData) {
      setProjectList(projectsData);
    }
  }, []);

  const fetchAllSprints = useCallback(async () => {
    const sprintsData = await getAllSprintsGlobalHelper({ setLoading });
    if (sprintsData) {
      dispatch(setSprints(sprintsData));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllProjects();
    fetchAllSprints();
  }, [fetchAllProjects, fetchAllSprints]);

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
              onEditSprint={(sprint) => setSprintToEdit(sprint)}
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
                sprint={sprintToEdit}
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
