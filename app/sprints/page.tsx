"use client"

import { useState } from "react"
import { SprintsHeader } from "@/components/sprints/sprints-header"
import { SprintsList } from "@/components/sprints/sprints-list"
import { CreateSprintDialog } from "@/components/sprints/create-sprint-dialog"

export default function Sprints() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <SprintsHeader onCreateSprint={() => setIsCreateDialogOpen(true)} />
      <SprintsList />
      <CreateSprintDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
