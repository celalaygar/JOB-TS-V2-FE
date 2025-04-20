import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import { TeamCard } from "./team-card"
import type { ProjectWithTeams } from "@/data/teams"

interface ProjectTeamsListProps {
  projects: ProjectWithTeams[]
  searchQuery: string
}

export function ProjectTeamsList({ projects, searchQuery }: ProjectTeamsListProps) {
  // Filter projects and teams based on search query
  const filteredProjects = projects.filter((project) => {
    // Check if project name matches search
    if (project.projectName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true
    }

    // Check if any team name matches search
    return project.teams.some(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  })

  if (filteredProjects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No teams found</h3>
          <p className="text-muted-foreground text-center mt-2">
            {searchQuery ? "Try adjusting your search query" : "There are no teams created yet"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Accordion type="multiple" defaultValue={filteredProjects.map((p) => p.projectId)} className="space-y-4">
      {filteredProjects.map((project) => (
        <AccordionItem key={project.projectId} value={project.projectId} className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center">
              <span className="font-medium">{project.projectName}</span>
              <Badge variant="outline" className="ml-2">
                {project.teams.length} {project.teams.length === 1 ? "team" : "teams"}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {project.teams.map((team) => (
                <TeamCard key={team.id} team={team} projectId={project.projectId} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
