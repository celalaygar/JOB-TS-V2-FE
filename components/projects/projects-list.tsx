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
import BaseService from "@/lib/service/BaseService"
import { toast } from "@/hooks/use-toast"
import { Project } from "@/types/project"
import { PROJECT_URL } from "@/lib/service/BasePath"
import { CreateProjectDialog } from "./create-project-dialog"
import { httpMethods } from "@/lib/service/HttpService"

export function ProjectsList() {
  const dispatch = useDispatch()
  const allProjects = useSelector((state: RootState) => state.projects.projects)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [progressFilter, setProgressFilter] = useState("all")
  const [sortOption, setSortOption] = useState("name-asc")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [projectToEdit, setProjectToEdit] = useState<string | null>(null)

  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState<Project[] | []>([]);

  const getAllProjects = useCallback(async () => {
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_URL, {
        method: httpMethods.GET,
      })
      let projectList = response as Project[];
      setProjectList(projectList)
      dispatch(setProjects(projectList))
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
    getAllProjects()
  }, [getAllProjects])

  // Apply sorting
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
  }, [projectList, sortOption])


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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(allProjects && (allProjects.length > 0)) ? allProjects.map((project) => (
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
                    <DropdownMenuItem onClick={() => setProjectToEdit(project.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-[var(--fixed-danger)]"
                      onClick={() => setProjectToDelete(project.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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
                  <span className="text-[var(--fixed-sidebar-muted)]">{project.issueCount} issues</span>
                </div>
                <div className="flex -space-x-2">
                  {/* {project.team.map((member, i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-[var(--fixed-card-bg)]">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                  ))} */}
                </div>
              </div>
            </div>
            <div className="p-4 pt-0 flex gap-2">
              <Button
                className="flex-1 bg-[var(--fixed-primary)] text-white"
                asChild>
                <Link href={`/projects/${project.id}`}>Details</Link>
              </Button>
            </div>
          </div>
        )) :
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <button
              className="fixed-primary-button h-10 px-4 py-2 rounded-md flex items-center text-sm font-medium"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </button>
            <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
          </div>
        }
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated issues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDeleteProject}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Project Dialog */}
      {projectToEdit && (
        <EditProjectDialog
          projectId={projectToEdit}
          open={!!projectToEdit}
          onOpenChange={(open) => !open && setProjectToEdit(null)}
        />
      )}
    </>
  )
}
