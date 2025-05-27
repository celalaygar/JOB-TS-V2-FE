import { ProjectRolesManagement } from "@/components/projects/project-roles/project-roles-management"
import { Project } from "@/types/project"

interface ProjectRolesTabProps {
  project: Project | {}
  projectId: string
}

export function ProjectRolesTab({ project, projectId }: ProjectRolesTabProps) {
  return (
    <div className="space-y-4">
      <ProjectRolesManagement project={project} projectId={projectId} />
    </div>
  )
}
