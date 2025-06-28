"use client"

import { useState } from "react"
import type React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/types/task"
import { AlertCircle, BookOpen, Bug, GitBranch, Lightbulb, MoreVertical } from "lucide-react"
import { TaskDetailsDialog } from "@/components/tasks/task-details-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"

interface KanbanCardProps {
  task: Task
}

export default function KanbanCard({ task }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", task.id)
    e.dataTransfer.effectAllowed = "move"
    setIsDragging(true)

    // Create a fully visible drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.position = "absolute"
    dragImage.style.top = "-1000px"
    dragImage.style.left = "-1000px"
    dragImage.style.background = "white"
    dragImage.style.border = "2px solid #3b82f6"
    dragImage.style.borderRadius = "8px"
    dragImage.style.padding = "12px"
    dragImage.style.boxShadow = "0 10px 25px -3px rgba(0, 0, 0, 0.3)"
    dragImage.style.opacity = "1"
    //dragImage.style.transform = "rotate(3deg) scale(1.05)"
    dragImage.style.pointerEvents = "none"
    dragImage.style.zIndex = "9999"
    dragImage.style.width = e.currentTarget.offsetWidth + "px"
    dragImage.style.fontFamily = "inherit"
    document.body.appendChild(dragImage)

    // Set this copy as the drag image with better positioning
    e.dataTransfer.setDragImage(dragImage, e.currentTarget.offsetWidth / 2, 30)

    // Clean up the copy after drag starts
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage)
      }
    }, 100)
  }

  const getTypeIcon = () => {
    switch (task.taskType) {
      case "bug":
        return <Bug className="h-4 w-4" />
      case "feature":
        return <Lightbulb className="h-4 w-4" />
      case "story":
        return <BookOpen className="h-4 w-4" />
      case "subtask":
        return <GitBranch className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getTypeColor = () => {
    switch (task.taskType) {
      case "bug":
        return "bg-red-100 text-red-800 border-red-200"
      case "feature":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "story":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "subtask":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = () => {
    switch (task.priority.toLowerCase()) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <div
        className={`bg-white p-3 rounded-lg border shadow-sm cursor-grab hover:border-primary transition-all duration-200 relative ${isDragging
          ? "opacity-90 scale-105 rotate-2 shadow-xl border-primary ring-2 ring-primary/20"
          : "hover:shadow-md"
          }`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className={getTypeColor()}>
            <span className="flex items-center gap-1">
              {getTypeIcon()}
              {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
            </span>
          </Badge>

          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getPriorityColor()}`} title={`Priority: ${task.priority}`} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDetailsDialog(true)
                  }}
                >
                  Show Task
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowEditDialog(true)
                  }}
                >
                  Edit Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <h4 className="font-medium mb-2 line-clamp-2">{task.title}</h4>
        <div className="text-xs text-muted-foreground mb-3">
          {task.taskNumber} • {new Date(task.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs">{task.projectName}</div>
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                {task.assignee.initials}
              </div>
            </Avatar>
          )}
        </div>
      </div>

      {/* Task Details Dialog */}
      <TaskDetailsDialog taskId={task.id} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />

      {/* Edit Task Dialog */}
      <EditTaskDialog taskId={task.id} open={showEditDialog} onOpenChange={setShowEditDialog} />
    </>
  )
}
