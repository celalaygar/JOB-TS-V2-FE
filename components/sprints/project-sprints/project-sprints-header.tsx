"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface ProjectSprintsHeaderProps {
  onCreateSprint: () => void
}

export function ProjectSprintsHeader({ onCreateSprint }: ProjectSprintsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Sprints</h1>
        <p className="text-[var(--fixed-sidebar-muted)]">Manage and track your project's development cycles</p>
      </div>
      <Button className="bg-[var(--fixed-primary)] text-white" onClick={onCreateSprint}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Sprint
      </Button>
    </div>
  )
}
