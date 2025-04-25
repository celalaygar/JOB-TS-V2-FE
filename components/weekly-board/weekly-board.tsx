"use client"

import { useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { DragDropContext, type DropResult } from "react-beautiful-dnd"
import { moveHourlyIssue } from "@/lib/redux/features/weekly-board-slice"
import { WeeklyBoardDay } from "@/components/weekly-board/weekly-board-day"
import { format, addDays, parseISO } from "date-fns"

interface WeeklyBoardProps {
  filters: {
    project: string
    user: string
    completed: string
  }
  onAddIssue: (day: string, hour: number) => void
}

export function WeeklyBoard({ filters, onAddIssue }: WeeklyBoardProps) {
  const dispatch = useDispatch()
  const hourlyIssues = useSelector((state: RootState) => state.weeklyBoard.hourlyIssues)
  const selectedWeek = useSelector((state: RootState) => state.weeklyBoard.selectedWeek)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  // Apply filters
  const filteredIssues = useMemo(() => {
    return hourlyIssues.filter((issue) => {
      // Project filter
      const matchesProject = filters.project === "all" || issue.projectId === filters.project

      // User filter
      const matchesUser = filters.user === "all" || issue.userId === filters.user

      // Completed filter
      const matchesCompleted =
        filters.completed === "all" ||
        (filters.completed === "completed" && issue.completed) ||
        (filters.completed === "pending" && !issue.completed)

      return matchesProject && matchesUser && matchesCompleted
    })
  }, [hourlyIssues, filters])

  // Parse the selected week (Monday) and calculate the days of the week
  const startDate = parseISO(selectedWeek)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i)
    return {
      date,
      dayName: format(date, "EEEE").toLowerCase() as
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday",
      displayName: format(date, "EEE"),
      displayDate: format(date, "MMM d"),
    }
  })

  // Define working hours (9 AM to 6 PM)
  const workingHours = Array.from({ length: 10 }, (_, i) => i + 9)

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back in its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Parse the droppable ID to get day and hour
    // Format: "day-hour" (e.g., "monday-9")
    const [sourceDay, sourceHour] = source.droppableId.split("-")
    const [destDay, destHour] = destination.droppableId.split("-")

    // Move the issue
    dispatch(
      moveHourlyIssue({
        id: draggableId,
        newDay: destDay as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
        newHour: Number.parseInt(destHour),
      }),
    )
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <WeeklyBoardDay
              key={day.dayName}
              day={day.dayName}
              displayName={day.displayName}
              displayDate={day.displayDate}
              workingHours={workingHours}
              issues={filteredIssues.filter((issue) => issue.day === day.dayName)}
              onAddIssue={(hour) => onAddIssue(day.dayName, hour)}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
