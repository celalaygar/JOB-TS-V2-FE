"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, MoreHorizontal, Plus, FolderPlus } from "lucide-react"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { updateSprint } from "@/lib/redux/features/sprints-slice"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sprint, SprintStatus } from "@/types/sprint"

interface SprintDetailHeaderProps {
  sprint: Sprint
  onAddTask: () => void
  onCompleteSprint: () => void
  onAssignTasksToSprint: () => void
}

export function SprintDetailHeader({
  sprint,
  onAddTask,
  onCompleteSprint,
  onAssignTasksToSprint,
}: SprintDetailHeaderProps) {
  const dispatch = useDispatch()

  const handleStatusChange = (status: string) => {
    dispatch(
      updateSprint({
        id: sprint.id,
        changes: { status },
      }),
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sprints">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back to Sprints</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{sprint.name}</h1>
          <p className="text-sm text-muted-foreground">Sprint details and task management</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onAddTask} className="bg-[var(--fixed-primary)] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new task in this sprint</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onAssignTasksToSprint} variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                Assign Tasks
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Assign existing tasks from backlog to this sprint</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sprint.sprintStatus !== SprintStatus.PLANNED && (
              <DropdownMenuItem onClick={() => handleStatusChange("planned")}>Mark as Planned</DropdownMenuItem>
            )}
            {sprint.sprintStatus !== SprintStatus.ACTIVE && (
              <DropdownMenuItem onClick={() => handleStatusChange("active")}>Start Sprint</DropdownMenuItem>
            )}
            {sprint.sprintStatus === SprintStatus.ACTIVE && (
              <DropdownMenuItem onClick={() => onCompleteSprint()}>Complete Sprint</DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={`/sprints/${sprint.id}/edit`}>Edit Sprint</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
