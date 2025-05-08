"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { projects } from "@/data/projects"

interface ProjectSelectorProps {
  selectedProjectId: string | null
  onProjectChange: (projectId: string | null) => void
}

export function ProjectSelector({ selectedProjectId, onProjectChange }: ProjectSelectorProps) {
  return (
    <div className="w-full md:w-64">
      <Select value={selectedProjectId || ""} onValueChange={(value) => onProjectChange(value || null)}>
        <SelectTrigger>
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
