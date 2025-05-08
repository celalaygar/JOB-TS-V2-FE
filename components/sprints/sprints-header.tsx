"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface SprintsHeaderProps {
  onCreateSprint: () => void
}

export function SprintsHeader({ onCreateSprint }: SprintsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sprint Planning</h1>
        <p className="text-[var(--fixed-sidebar-muted)]">Plan and manage your development cycles.</p>
      </div>
      <Button className="bg-[var(--fixed-primary)] text-white" onClick={onCreateSprint}>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Sprint
      </Button>
    </div>
  )
}
