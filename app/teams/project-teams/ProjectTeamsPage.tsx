"use client"

import { useCallback, useEffect, useState } from "react"
import { ProjectTeamsHeader } from "@/components/teams/project-teams/project-teams-header"
import { ProjectTeamsSearch } from "@/components/teams/project-teams/project-teams-search"
import { ProjectTeamsList } from "@/components/teams/project-teams/project-teams-list"
import { CreateTeamDialog } from "@/components/teams/project-teams/create-team-dialog"
import { ProjectSelector } from "@/components/teams/project-teams/project-selector"
import { projectsWithTeams } from "@/data/teams"
import { Project, ProjectTeam } from "@/types/project"
import { useDispatch } from "react-redux"
import { setProjects } from "@/lib/redux/features/projects-slice"
import { getAllProjectsHelper, getAllProjectTeamsHelper } from "@/lib/service/api-helpers"
import { Loader2 } from "lucide-react"

export default function ProjectTeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false)
  const [projects, setProject] = useState<Project[] | []>([]);
  const [projectTeams, setProjectTeams] = useState<ProjectTeam[]>([]);
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

  const fetchAllProjectsTeams = useCallback(async () => {
    const response: ProjectTeam[] | null = await getAllProjectTeamsHelper({ setLoading: setLoading });
    if (response) {
      setProjectTeams(response);
    }
  }, []);


  useEffect(() => {
    fetchAllProjects();
    fetchAllProjectsTeams();
  }, [fetchAllProjects, fetchAllProjectsTeams]);



  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleProjectChange = (projectId: string | null) => {
    setSelectedProjectId(projectId)
  }


  return (
    <div className="container mx-auto py-6 space-y-6">

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : (
        <>
          <ProjectTeamsHeader onCreateTeam={() => setIsCreateTeamDialogOpen(true)} />

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <ProjectSelector selectedProjectId={selectedProjectId} onProjectChange={handleProjectChange} />
            <ProjectTeamsSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />
          </div>

          <ProjectTeamsList
            projectTeams={projectTeams}
            searchQuery={searchQuery} />

          <CreateTeamDialog isOpen={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen} projects={projects} />

        </>
      )}
    </div>
  )
}
