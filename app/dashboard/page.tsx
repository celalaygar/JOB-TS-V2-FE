"use client"

import { useCallback, useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import { QuickNavigation } from "@/components/dashboard/quick-navigation"
import { Project } from "@/types/project"
import { useDispatch } from "react-redux"
import { getAllProjectsHelper } from "@/lib/service/api-helpers"
import { setProjects } from "@/lib/redux/features/projects-slice"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [projects, setProject] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const fetchAllProjects = useCallback(async () => {
    const projectsData: Project[] | null = await getAllProjectsHelper({ setLoading: setLoading });
    if (projectsData) {
      setProject(projectsData);
      dispatch(setProjects(projectsData));
    } else {
      setProject([]);
    }
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects])
  return (
    <div className="space-y-6">
      <DashboardHeader onCreateIssue={() => setIsCreateDialogOpen(true)} />
      <DashboardStats />
      <QuickNavigation />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {
          loading ?
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </div>
            :
            <>
              <RecentTasks />
              <ProjectProgress />
            </>
        }
      </div>
    </div>
  )
}
