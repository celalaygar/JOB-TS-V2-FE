"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Loader2, MoreHorizontal, Pencil, PlusCircle, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { removeProject, setProjects } from "@/lib/redux/features/projects-slice"
import type { RootState } from "@/lib/redux/store"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"
import { Project } from "@/types/project"
import { CreateProjectDialog } from "./create-project-dialog"
import { getAllProjectsHelper } from "@/lib/service/api-helpers" // Import the new helper
import { useLanguage } from "@/lib/i18n/context"

export function ProjectsList() {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const allProjects = useSelector((state: RootState) => state.projects.projects)
  const [sortOption, setSortOption] = useState("name-asc")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)

  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState<Project[] | []>([]);

  const fetchAllProjects = useCallback(async () => {
    setProjectList([]);
    const projectsData: Project = await getAllProjectsHelper({ setLoading });
    if (projectsData) {
      //setProjectList(projectsData);
      dispatch(setProjects(projectsData));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  const sortedProjects = useMemo(() => {
    if (!allProjects) return []

    setLoading(true)
    let data = [...allProjects].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "progress-asc":
          return a.progress - b.progress
        case "progress-desc":
          return b.progress - a.progress
        case "issues-asc":
          return a.issueCount - b.issueCount
        case "issues-desc":
          return b.issueCount - a.issueCount
        default:
          return 0
      }
    })

    setLoading(false)
    return data;
  }, [allProjects, sortOption])


  const handleDeleteProject = () => {
    if (projectToDelete) {
      dispatch(removeProject(projectToDelete))
      setProjectToDelete(null)
    }
  }
  return loading ? (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </>
  ) : (
    <>
      <div className="topdiv grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(allProjects && (allProjects.length > 0)) ?
          allProjects.map((project: Project) => (
            <div key={project.id} className="fixed-card rounded-lg overflow-hidden">
              <div className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[var(--fixed-sidebar-fg)]">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setProjectToEdit(project)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {translations.projects.editProject}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[var(--fixed-danger)]"
                        onClick={() => setProjectToDelete(project.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {translations.projects.deleteProject}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-[var(--fixed-sidebar-muted)] mt-1">{project.description}</p>
              </div>
              <div className="p-4 pt-2 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>Progress</div>
                    <div className="font-medium">{project.progress}%</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--fixed-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--fixed-primary)]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Badge
                      className={`mr-2 ${project.status === "Completed"
                        ? "bg-[var(--fixed-success)] text-white"
                        : project.status === "In Progress"
                          ? "bg-[var(--fixed-primary)] text-white"
                          : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                        }`}
                    >
                      {project.status}
                    </Badge>
                    <span className="text-[var(--fixed-sidebar-muted)]">{0} Tasks</span>
                  </div>
                  <div className="flex -space-x-2">
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <p className="text-sm text-[var(--fixed-sidebar-muted)] mt-1">
                  <b>Created by: </b>{project.createdBy?.firstname + " " + project.createdBy?.lastname || "Unknown"} <br />
                  <b> Email: </b>{project.createdBy?.email || "N/A"}
                </p>
              </div>
              <div className="p-4 pt-0 flex gap-2">
                <Button
                  className="flex-1 bg-[var(--fixed-primary)] text-white"
                  asChild>
                  <Link href={`/projects/${project.id}`}>{translations.projects.details}</Link>
                </Button>
              </div>
            </div>
          )) :
          <div className="noProjectDiv w-full flex flex-col items-center justify-center col-span-full min-h-[300px]">
            <h1 className="text-2xl font-bold mb-4">{translations.projects.notFound}</h1>
            <button
              className="fixed-primary-button h-10 px-4 py-2 rounded-md flex items-center text-sm font-medium"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {translations.projects.newProject}
            </button>
            <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
          </div>
        }
      </div>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {translations.projects.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              {translations.projects.cancel}
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDeleteProject}>
              {translations.projects.deleteProject}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {projectToEdit && (
        <EditProjectDialog
          project={projectToEdit}
          open={!!projectToEdit}
          onOpenChange={(open) => !open && setProjectToEdit(null)}
        />
      )}
    </>
  )
}
