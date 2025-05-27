"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { ProjectSprintsHeader } from "@/components/sprints/project-sprints/project-sprints-header"
import { ProjectSprintsList } from "@/components/sprints/project-sprints/project-sprints-list"
import { ProjectSprintsFilters } from "@/components/sprints/project-sprints/project-sprints-filters"
import { CreateSprintDialog } from "@/components/sprints/project-sprints/create-sprint-dialog"
import { EditSprintDialog } from "@/components/sprints/project-sprints/edit-sprint-dialog"
import { DeleteSprintDialog } from "@/components/sprints/project-sprints/delete-sprint-dialog"
import { Pagination } from "@/components/ui/pagination"

export default function ProjectSprints() {
  // State for dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [sprintToEdit, setSprintToEdit] = useState<string | null>(null)
  const [sprintToDelete, setSprintToDelete] = useState<string | null>(null)

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
    if (filters.team && !sprint.team.some((member) => member.name.includes(filters.team))) {
      return false
    }

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

  return (
    <div className="space-y-6">
      <ProjectSprintsHeader onCreateSprint={() => setIsCreateDialogOpen(true)} />

      <ProjectSprintsFilters filters={filters} onFilterChange={handleFilterChange} teams={teams} />

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

      <CreateSprintDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      {sprintToEdit && (
        <EditSprintDialog
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
    </div>
  )
}
