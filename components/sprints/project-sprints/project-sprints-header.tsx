"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { PlusCircle } from "lucide-react"

interface ProjectSprintsHeaderProps {
  onCreateSprint: () => void
}

export function ProjectSprintsHeader({ onCreateSprint }: ProjectSprintsHeaderProps) {
  const { translations } = useLanguage()
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{translations.sprint.title}</h1>
        <p className="text-[var(--fixed-sidebar-muted)]">{translations.sprint.description}</p>
      </div>
      <Button className="bg-[var(--fixed-primary)] text-white" onClick={onCreateSprint}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {translations.sprint.createSprint}
      </Button>
    </div>
  )
}
