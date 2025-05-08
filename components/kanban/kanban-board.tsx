"use client"

import { tasks } from "@/data/tasks"
import { useState, useEffect } from "react"
import KanbanColumn from "./kanban-column"
import type { Task } from "@/types/task"

const STATUSES = [
  { key: "to-do", title: "To Do", className: "bg-gray-50 dark:bg-gray-900" },
  { key: "in-progress", title: "In Progress", className: "bg-blue-50 dark:bg-blue-950" },
  { key: "review", title: "Review", className: "bg-red-50 dark:bg-red-950" },
  { key: "done", title: "Done", className: "bg-green-50 dark:bg-green-950" },
]

export default function KanbanBoard() {
  const [statusTasks, setStatusTasks] = useState<Record<string, Task[]>>({})

  useEffect(() => {
    const grouped: Record<string, Task[]> = {}
    STATUSES.forEach(({ key }) => {
      grouped[key] = tasks.filter((task) => task.status === key)
    })
    setStatusTasks(grouped)
  }, [])

  const handleDragEnd = (taskId: string, targetStatus: string) => {
    const allTasks = Object.values(statusTasks).flat()
    const task = allTasks.find((t) => t.id === taskId)
    if (!task) return

    const updatedTask = { ...task, status: targetStatus }
    const newStatusTasks: Record<string, Task[]> = {}

    for (const { key } of STATUSES) {
      newStatusTasks[key] = statusTasks[key]?.filter((t) => t.id !== taskId) || []
    }

    newStatusTasks[targetStatus] = [...(newStatusTasks[targetStatus] || []), updatedTask]
    setStatusTasks(newStatusTasks)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 h-full overflow-auto">
      {STATUSES.map(({ key, title, className }) => (
        <KanbanColumn
          key={key}
          title={title}
          status={key}
          tasks={statusTasks[key] || []}
          onDragEnd={handleDragEnd}
          className={className}
        />
      ))}
    </div>
  )
}
