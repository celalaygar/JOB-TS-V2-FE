"use client"

import type React from "react"

import type { ProjectTask, Task } from "@/types/task"
import KanbanCard from "./kanban-card"
import { Project } from "@/types/project"

interface KanbanColumnProps {
  title: string
  tasks: ProjectTask[]
  status: string
  onDragEnd: (taskId: string, targetStatus: string) => void
  className?: string
}

export default function KanbanColumn({ title, tasks, status, onDragEnd, className = "" }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-primary", "border-2")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("border-primary", "border-2")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-primary", "border-2")

    const taskId = e.dataTransfer.getData("text/plain")
    if (taskId) {
      onDragEnd(taskId, status)
    }
  }

  return (
    <div
      className={`flex flex-col h-full rounded-lg border ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-3 border-b bg-muted/30">
        <h2 className="font-bold text-md flex items-center justify-between">
          {title} <span className=" bg-muted px-2 py-1 rounded-full">{tasks.length}</span>
        </h2>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-24 border border-dashed rounded-lg text-muted-foreground text-sm">
            No tasks
          </div>
        ) : (
          tasks.map((task) =>
            <KanbanCard
              key={task.id} task={task}
            />)
        )}
      </div>
    </div>
  )
}
