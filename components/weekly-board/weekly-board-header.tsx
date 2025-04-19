"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { setSelectedWeek } from "@/lib/redux/features/weekly-board-slice"
import { format, addDays, parseISO, addWeeks, subWeeks } from "date-fns"

interface WeeklyBoardHeaderProps {
  onAddIssue: () => void
  showFilters: boolean
  onToggleFilters: () => void
}

export function WeeklyBoardHeader({ onAddIssue, showFilters, onToggleFilters }: WeeklyBoardHeaderProps) {
  const dispatch = useDispatch()
  const selectedWeek = useSelector((state: RootState) => state.weeklyBoard.selectedWeek)

  // Parse the selected week (Monday) and calculate the end of the week (Sunday)
  const startDate = parseISO(selectedWeek)
  const endDate = addDays(startDate, 6)

  // Format the date range for display
  const dateRangeText = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`

  const handlePreviousWeek = () => {
    const newWeek = subWeeks(parseISO(selectedWeek), 1).toISOString()
    dispatch(setSelectedWeek(newWeek))
  }

  const handleNextWeek = () => {
    const newWeek = addWeeks(parseISO(selectedWeek), 1).toISOString()
    dispatch(setSelectedWeek(newWeek))
  }

  const handleCurrentWeek = () => {
    const now = new Date()
    const day = now.getDay() // 0 is Sunday, 1 is Monday, etc.
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    const monday = new Date(now.setDate(diff))
    monday.setHours(0, 0, 0, 0)
    dispatch(setSelectedWeek(monday.toISOString()))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Board</h1>
          <p className="text-[var(--fixed-sidebar-muted)]">Track and manage your hourly tasks throughout the week</p>
        </div>
        <Button className="mt-2 sm:mt-0 bg-[var(--fixed-primary)] text-white" onClick={onAddIssue}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousWeek}
            className="border-[var(--fixed-card-border)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-lg font-medium px-2">{dateRangeText}</div>

          <Button variant="outline" size="icon" onClick={handleNextWeek} className="border-[var(--fixed-card-border)]">
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCurrentWeek}
            className="ml-2 border-[var(--fixed-card-border)]"
          >
            Today
          </Button>
        </div>

        <Button
          variant="outline"
          className={`border-[var(--fixed-card-border)] ${showFilters ? "bg-[var(--fixed-secondary)]" : ""}`}
          onClick={onToggleFilters}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
    </div>
  )
}
