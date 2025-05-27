"use client"

import { format, addDays } from "date-fns"
import { WeeklyBoardDay } from "./weekly-board-day"
import type { Task } from "@/app/weekly-board/page"

interface WeeklyBoardProps {
  selectedWeek: Date
  tasks: Task[]
  onAddTask: (day: Task["day"], hour: number) => void
  onEditTask: (task: Task) => void
  onToggleTaskCompletion: (taskId: string) => void
  onTaskDrop: (taskId: string, newDay: Task["day"], newHour: number) => void
}

export function WeeklyBoard({
  selectedWeek,
  tasks,
  onAddTask,
  onEditTask,
  onToggleTaskCompletion,
  onTaskDrop,
}: WeeklyBoardProps) {
  // Generate the days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(selectedWeek, i)
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDays.map((day) => (
        <WeeklyBoardDay
          key={day.dayName}
          day={day.dayName}
          displayName={day.displayName}
          displayDate={day.displayDate}
          date={day.date}
          workingHours={workingHours}
          tasks={tasks.filter((task) => task.day === day.dayName)}
          onAddTask={(hour) => onAddTask(day.dayName, hour)}
          onEditTask={onEditTask}
          onToggleTaskCompletion={onToggleTaskCompletion}
          onTaskDrop={onTaskDrop}
        />
      ))}
    </div>
  )
}
