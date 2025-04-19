"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { useLanguage } from "@/lib/i18n/context"

export function BacklogHeader() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { translations } = useLanguage()

  return (
    <div className="border-b border-[var(--fixed-card-border)] bg-[var(--fixed-card-bg)] px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{translations.backlog.title}</h1>
        <p className="text-sm text-[var(--fixed-sidebar-fg)]">{translations.backlog.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations.backlog.newTask}
        </Button>
      </div>
      <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
