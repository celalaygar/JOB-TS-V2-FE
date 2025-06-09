"use client"

import type React from "react"

import { format } from "date-fns"
import { WeeklyBoardTask } from "./weekly-board-task"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Task } from "@/app/weekly-board/page"

interface WeeklyBoardHourProps {
  day: Task["day"]
  hour: number
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onToggleTaskCompletion: (taskId: string) => void
  onTaskDrop: (taskId: string, newDay: Task["day"], newHour: number) => void
}

export function WeeklyBoardHour({
  day,
  hour,
  tasks,
  onAddTask,
  onEditTask,
  onToggleTaskCompletion,
  onTaskDrop,
}: WeeklyBoardHourProps) {
  // Format hour for display (e.g., "9:00 AM")
  const displayHour = format(new Date().setHours(hour, 0, 0, 0), "h:00 a")

  // Check if current hour
  const now = new Date()
  const isCurrentHour = now.getHours() === hour

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-primary/5")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-primary/5")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-primary/5")

    const taskId = e.dataTransfer.getData("text/plain")
    if (taskId) {
      onTaskDrop(taskId, day, hour)
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2">
        <div className="text-xs font-medium text-muted-foreground">
          {displayHour}
          {isCurrentHour && <span className="ml-2 text-primary">• Now</span>}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onAddTask}>
          <Plus className="h-3 w-3" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>

      <div
        className="min-h-[60px] rounded-md p-1 transition-colors bg-secondary"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-day={day}
        data-hour={hour}
      >
        {tasks.map((task) => (
          <WeeklyBoardTask
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onToggleCompletion={() => onToggleTaskCompletion(task.id)}
          />
        ))}

        {tasks.length === 0 && (
          <div
            className="h-full w-full flex items-center justify-center text-xs text-muted-foreground py-2"
            onClick={onAddTask}
          >
            <span className="cursor-pointer hover:text-primary">+ Add task</span>
          </div>
        )}
      </div>
    </div>
  )
}
