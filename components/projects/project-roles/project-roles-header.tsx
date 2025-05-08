"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProjectRolesHeaderProps {
  onAddRole: () => void
}

export function ProjectRolesHeader({ onAddRole }: ProjectRolesHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
      <Button className="bg-[var(--fixed-primary)] text-white" onClick={onAddRole}>
        <Plus className="h-4 w-4 mr-2" />
        Add Role
      </Button>
    </div>
  )
}
