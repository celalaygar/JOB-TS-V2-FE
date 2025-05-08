"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProjectTeamsHeaderProps {
  onCreateTeam: () => void
}

export function ProjectTeamsHeader({ onCreateTeam }: ProjectTeamsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Teams</h1>
        <p className="text-muted-foreground">View and manage teams for all projects</p>
      </div>

      <Button onClick={onCreateTeam}>
        <Plus className="h-4 w-4 mr-2" />
        Create Team
      </Button>
    </div>
  )
}
