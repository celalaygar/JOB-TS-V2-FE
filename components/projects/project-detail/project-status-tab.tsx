"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Trash2, Edit, ArrowUpDown, Loader2 } from "lucide-react"
import { ProjectTaskStatusDialog } from "@/components/projects/project-task-status-dialog"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Project, ProjectTaskStatus } from "@/types/project"
import { getAllProjectTaskStatusHelper, saveTaskStatusHelper } from "@/lib/service/api-helpers"
import { useLanguage } from "@/lib/i18n/context"


interface Status {
  id: string
  name: string
  label: string
  color: string
  order: number
  turkish: string
  english: string
}

interface ProjectStatusTabProps {
  project: Project
  projectId: string
}

export function ProjectStatusTab({ project, projectId }: ProjectStatusTabProps) {
  const [loading, setLoading] = useState(false);
  const { translations } = useLanguage()
  const [loadingDialog, setLoadingDialog] = useState(false);

  const [statuses, setStatuses] = useState<ProjectTaskStatus[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ProjectTaskStatus | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<keyof Status>("order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterLanguage, setFilterLanguage] = useState<"all" | "turkish" | "english">("all")

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">{translations.projects.notFound}</h1>
      </div>
    )
  }

  const fetchAllProjectTaskStatus = useCallback(async () => {
    setStatuses([]);
    const statusesData = await getAllProjectTaskStatusHelper(project.id, { setLoading });
    if (statusesData) {
      setStatuses(statusesData);
    }
  }, [project.id]);

  useEffect(() => {
    fetchAllProjectTaskStatus();
  }, [fetchAllProjectTaskStatus]);

  const handleCreateStatus = async (status: ProjectTaskStatus) => {
    const newStatusData = { ...status, projectId: project.id };
    const response = await saveTaskStatusHelper(newStatusData, { setLoading: setLoadingDialog });
    if (response) {
      setStatuses((prevStatuses) => [...prevStatuses, response]);
      setStatusDialogOpen(false);
    }
  };

  const handleUpdateStatus = async (updatedStatus: ProjectTaskStatus) => {
    const newStatusData = { ...updatedStatus, projectId: project.id };
    const response = await saveTaskStatusHelper(newStatusData, { setLoading: setLoadingDialog });
    if (response) {
      fetchAllProjectTaskStatus();
      setStatusDialogOpen(false);
      setSelectedStatus(null);
    }
  };

  const handleDeleteStatus = () => {
    if (selectedStatus) {
      setStatuses(statuses.filter((status) => status.id !== selectedStatus.id))
      setDeleteDialogOpen(false)
      setSelectedStatus(null)
    }
  }

  const handleSort = (field: keyof Status) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedStatuses = statuses
    .filter((status) => {
      const matchesSearch =
        status.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.turkish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.english.toLowerCase().includes(searchQuery.toLowerCase())

      if (filterLanguage === "all") return matchesSearch
      if (filterLanguage === "turkish") return status.turkish && matchesSearch
      if (filterLanguage === "english") return status.english && matchesSearch
      return matchesSearch
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">{translations.projects.taskStatusManagement}</h2>
        <Button
          className="bg-[var(--fixed-primary)] text-white"
          onClick={() => {
            setSelectedStatus(null)
            setStatusDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {translations.projects.addStatus}
        </Button>
      </div>

      <Card className="fixed-card">
        <CardHeader>
          <CardTitle>{translations.projects.projectStatuses}</CardTitle>
          <CardDescription className="text-[var(--fixed-sidebar-muted)]">
            {translations.projects.manageStatuses} {project.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                <Input
                  placeholder={translations.projects.searchStatuses}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterLanguage} onValueChange={(value: any) => setFilterLanguage(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={translations.projects.filterByLanguage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations.projects.allLanguages}</SelectItem>
                  <SelectItem value="turkish">{translations.projects.turkish}</SelectItem>
                  <SelectItem value="english">{translations.projects.english}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[768px] rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-4 bg-[var(--fixed-secondary)] text-sm font-medium">
                  <div className="col-span-1 flex items-center cursor-pointer" onClick={() => handleSort("order")}>
                    <span>{translations.projects.order}</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  </div>
                  <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                    <span>{translations.projects.statusName}</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  </div>
                  <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort("label")}>
                    <span>{translations.projects.statusLabel}</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  </div>
                  <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort("turkish")}>
                    <span>{translations.projects.turkishValue}</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  </div>
                  <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort("english")}>
                    <span>{translations.projects.englishValue}</span>
                    <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <span className="sr-only">{translations.projects.actions}</span>
                  </div>
                </div>

                {filteredAndSortedStatuses.length > 0 ? (
                  filteredAndSortedStatuses.map((status: ProjectTaskStatus, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-[var(--fixed-secondary)] transition-colors"
                    >
                      <div className="col-span-1 flex items-center gap-2">
                        <span className="font-medium">{status.order}</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="font-medium text-[var(--fixed-sidebar-fg)]">{status.name}</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Badge
                          style={{
                            backgroundColor: status.color,
                            color: status.color === "#E2E8F0" ? "#1E293B" : "white",
                          }}
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                          {status.turkish}
                        </Badge>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                          {status.english}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">{translations.projects.openMenu}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedStatus(status)
                                setStatusDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>{translations.projects.edit}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedStatus(status)
                                setDeleteDialogOpen(true)
                              }}
                              className="text-[var(--fixed-danger)]"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{translations.projects.delete}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-[var(--fixed-sidebar-muted)]">{translations.projects.noStatusesFound}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProjectTaskStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        loading={loadingDialog}
        status={selectedStatus}
        onSave={(status) => {
          if (selectedStatus) {
            handleUpdateStatus({ ...status, id: selectedStatus.id })
          } else {
            handleCreateStatus(status)
          }
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{translations.projects.deleteStatusConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {translations.projects.deleteStatusWarning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{translations.projects.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStatus}
              className="bg-[var(--fixed-danger)] text-white hover:bg-[var(--fixed-danger)]/90"
            >
              {translations.projects.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
