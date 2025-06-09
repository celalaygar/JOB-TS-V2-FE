"use client"

import { Button } from "@/components/ui/button"
import { ClipboardList, Plus } from "lucide-react"

interface SprintDetailEmptyProps {
  onAddTask: () => void
}

export function SprintDetailEmpty({ onAddTask }: SprintDetailEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ClipboardList className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No tasks in this sprint</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        This sprint doesn't have any tasks yet. Add tasks to start tracking your work.
      </p>
      <Button onClick={onAddTask} className="mt-6 bg-[var(--fixed-primary)] text-white">
        <Plus className="mr-2 h-4 w-4" />
        Add First Task
      </Button>
    </div>
  )
}
