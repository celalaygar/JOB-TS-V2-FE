import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsList } from "@/components/projects/projects-list"

export default function Projects() {
  return (
    <div className="space-y-6">
      <ProjectsHeader />
      <ProjectsList />
    </div>
  )
}
