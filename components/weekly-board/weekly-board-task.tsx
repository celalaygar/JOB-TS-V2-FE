"use client"

import type React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/app/weekly-board/page"

interface WeeklyBoardTaskProps {
  task: Task
  onEdit: () => void
  onToggleCompletion: () => void
}

export function WeeklyBoardTask({ task, onEdit, onToggleCompletion }: WeeklyBoardTaskProps) {
  // Handle drag start
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id)
    e.dataTransfer.effectAllowed = "move"

    // Add a class to the element being dragged
    const target = e.currentTarget as HTMLElement
    setTimeout(() => {
      target.classList.add("opacity-50")
    }, 0)
  }

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.remove("opacity-50")
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        group relative p-2 mb-1 rounded-md border text-sm cursor-move
        ${task.color || "bg-white border-gray-200"}
        ${task.completed ? "opacity-70" : ""}
        transition-all duration-200 hover:shadow-md
      `}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggleCompletion}
          className="mt-0.5"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={`font-medium text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-3 w-3" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {task.projectName && <p className="text-xs text-muted-foreground truncate mt-1">{task.projectName}</p>}
        </div>
      </div>
    </div>
  )
}
