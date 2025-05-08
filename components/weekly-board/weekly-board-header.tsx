"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface WeeklyBoardHeaderProps {
  selectedWeek: Date
  onPreviousWeek: () => void
  onNextWeek: () => void
  onCurrentWeek: () => void
  onAddTask: () => void
}

export function WeeklyBoardHeader({
  selectedWeek,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  onAddTask,
}: WeeklyBoardHeaderProps) {
  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(selectedWeek)
  endOfWeek.setDate(selectedWeek.getDate() + 6)

  // Format the date range for display
  const dateRangeText = `${format(selectedWeek, "MMM d")} - ${format(endOfWeek, "MMM d, yyyy")}`

  // Check if current week is selected
  const isCurrentWeek = () => {
    const now = new Date()
    const day = now.getDay() // 0 is Sunday, 1 is Monday, etc.
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    const currentMonday = new Date(now)
    currentMonday.setDate(diff)
    currentMonday.setHours(0, 0, 0, 0)

    return selectedWeek.getTime() === currentMonday.getTime()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Board</h1>
          <p className="text-muted-foreground">Plan and manage your weekly schedule</p>
        </div>
        <Button className="mt-2 sm:mt-0 bg-primary text-white" onClick={onAddTask}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onPreviousWeek} className="border-border">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-lg font-medium px-2">{dateRangeText}</div>

          <Button variant="outline" size="icon" onClick={onNextWeek} className="border-border">
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onCurrentWeek}
            className={`ml-2 border-border ${isCurrentWeek() ? "bg-primary/10" : ""}`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
      </div>
    </div>
  )
}
