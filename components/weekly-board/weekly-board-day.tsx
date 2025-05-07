"use client"

import type React from "react"
import { WeeklyBoardHour } from "./weekly-board-hour"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/app/weekly-board/page"

interface WeeklyBoardDayProps {
  day: Task["day"]
  displayName: string
  displayDate: string
  date: Date
  workingHours: number[]
  tasks: Task[]
  onAddTask: (hour: number) => void
  onEditTask: (task: Task) => void
  onToggleTaskCompletion: (taskId: string) => void
  onTaskDrop: (taskId: string, newDay: Task["day"], newHour: number) => void
}

export function WeeklyBoardDay({
  day,
  displayName,
  displayDate,
  date,
  workingHours,
  tasks,
  onAddTask,
  onEditTask,
  onToggleTaskCompletion,
  onTaskDrop,
}: WeeklyBoardDayProps) {
  // Check if today
  const isToday = new Date().toDateString() === date.toDateString()

  // Count tasks for this day
  const taskCount = tasks.length
  const completedCount = tasks.filter((task) => task.completed).length

  // Handle drop on the day (outside of specific hour)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <Card className={`h-full ${isToday ? "border-primary" : "border-border"}`}>
      <CardHeader className={`py-3 px-4 ${isToday ? "bg-primary/10" : ""}`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">{displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">{displayDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {isToday && <Badge className="bg-primary text-white">Today</Badge>}
            <Badge variant="outline" className="border-border">
              {completedCount}/{taskCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-2" onDragOver={handleDragOver}>
        {workingHours.map((hour) => {
          const hourTasks = tasks.filter((task) => task.hour === hour)

          return (
            <WeeklyBoardHour
              key={`${day}-${hour}`}
              day={day}
              hour={hour}
              tasks={hourTasks}
              onAddTask={() => onAddTask(hour)}
              onEditTask={onEditTask}
              onToggleTaskCompletion={onToggleTaskCompletion}
              onTaskDrop={onTaskDrop}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}
