import { ProjectRolesManagement } from "@/components/projects/project-roles/project-roles-management"

interface ProjectRolesTabProps {
  projectId: string
}

export function ProjectRolesTab({ projectId }: ProjectRolesTabProps) {
  return (
    <div className="space-y-4">
      <ProjectRolesManagement projectId={projectId} />
    </div>
  )
}
