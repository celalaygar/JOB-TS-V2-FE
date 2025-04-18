"use client"

import { Droppable } from "react-beautiful-dnd"
import { WeeklyBoardIssue } from "@/components/weekly-board/weekly-board-issue"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { format } from "date-fns"
import type { HourlyIssue } from "@/lib/redux/features/weekly-board-slice"

interface WeeklyBoardHourProps {
  day: string
  hour: number
  issues: HourlyIssue[]
  onAddIssue: () => void
}

export function WeeklyBoardHour({ day, hour, issues, onAddIssue }: WeeklyBoardHourProps) {
  // Format hour for display (e.g., "9:00 AM")
  const displayHour = format(new Date().setHours(hour, 0, 0, 0), "h:00 a")

  // Check if current hour
  const now = new Date()
  const isCurrentHour = now.getHours() === hour

  // Droppable ID format: "day-hour" (e.g., "monday-9")
  const droppableId = `${day}-${hour}`

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2">
        <div className="text-xs font-medium text-[var(--fixed-sidebar-muted)]">
          {displayHour}
          {isCurrentHour && <span className="ml-2 text-[var(--fixed-primary)]">• Now</span>}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onAddIssue}>
          <Plus className="h-3 w-3" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-[60px] rounded-md p-1 transition-colors
              ${snapshot.isDraggingOver ? "bg-[var(--fixed-primary)]/5" : "bg-[var(--fixed-secondary)]"}
            `}
          >
            {issues.map((issue, index) => (
              <WeeklyBoardIssue key={issue.id} issue={issue} index={index} />
            ))}
            {provided.placeholder}

            {issues.length === 0 && (
              <div
                className="h-full w-full flex items-center justify-center text-xs text-[var(--fixed-sidebar-muted)] py-2"
                onClick={onAddIssue}
              >
                <span className="cursor-pointer hover:text-[var(--fixed-primary)]">+ Add task</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
