import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import { TeamCard } from "./team-card"
import type { ProjectWithTeams } from "@/data/teams"
import { Project, ProjectTeam } from "@/types/project"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"

interface ProjectTeamsListProps {
  searchQuery: string
  projectTeams?: ProjectTeam[]
}

export function ProjectTeamsList({ searchQuery, projectTeams }: ProjectTeamsListProps) {
  // Filter projects and teams based on search query

  const allProjects = useSelector((state: RootState) => state.projects.projects)
  const projects = allProjects.map((project) => {
    const teams = projectTeams?.filter((team) => team.createdProject.id === project.id) || []
    return {
      ...project,
      teams: teams
    }
  })


  if (!projectTeams || projectTeams.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No teams found</h3>
          <p className="text-muted-foreground text-center mt-2">
            {searchQuery ? "Try adjusting your search query" : "There are no teams created yet"}
          </p>
        </CardContent>
      </Card >
    )
  }

  return (
    <Accordion type="multiple" defaultValue={projects.map((p) => p.id)} className="space-y-4">
      {projects.map((project) => (
        <AccordionItem key={project.id} value={project.id} className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center">
              <span className="font-medium">{project.name}</span>
              <Badge variant="outline" className="ml-2">
                {project.teams.length} {project.teams.length === 1 ? "team" : "teams"}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {project.teams.map((team) => (
                <TeamCard key={team.id} team={team} projectId={project.id} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
