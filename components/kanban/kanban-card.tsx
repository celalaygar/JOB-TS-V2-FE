"use client"

import type React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { type Issue, taskTypeColors } from "@/types/issue"
import { AlertCircle, BookOpen, Bug, GitBranch, Lightbulb } from "lucide-react"
import { useState } from "react"

interface KanbanCardProps {
  issue: Issue
}

export default function KanbanCard({ issue }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false)



  const handleDragEnd = () => {
    setIsDragging(false)
  }
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", issue.id)
    setIsDragging(true)

    // Kartın görünür bir kopyasını oluştur
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.position = "absolute"
    dragImage.style.top = "-1000px"
    dragImage.style.left = "-1000px"
    dragImage.style.opacity = "1"
    dragImage.style.pointerEvents = "none" // Mouse etkileşimini engelle
    dragImage.style.zIndex = "1000"
    document.body.appendChild(dragImage)

    // Bu kopyayı sürükleme görseli olarak ayarla
    e.dataTransfer.setDragImage(dragImage, 0, 0)

    // Drag işlemi hemen başladığı için kopyayı biraz sonra temizliyoruz
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }
  const getTypeIcon = () => {
    switch (issue.taskType) {
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

  const getPriorityColor = () => {
    switch (issue.priority.toLowerCase()) {
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
    <div
      className={`bg-card p-3 rounded-lg border shadow-sm cursor-grab ${isDragging ? "opacity-700 bg-white-100" : ""
        } hover:border-primary transition-colors`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className={`${taskTypeColors[issue.taskType as keyof typeof taskTypeColors]}`}>
          <span className="flex items-center gap-1">
            {getTypeIcon()}
            {issue.taskType.charAt(0).toUpperCase() + issue.taskType.slice(1)}
          </span>
        </Badge>
        <div className={`h-2 w-2 rounded-full ${getPriorityColor()}`} title={`Priority: ${issue.priority}`} />
      </div>
      <h4 className="font-medium mb-2 line-clamp-2">{issue.title}</h4>
      <div className="text-xs text-muted-foreground mb-3">
        {issue.issueNumber} • {new Date(issue.createdAt).toLocaleDateString()}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs">{issue.projectName}</div>
        {issue.assignee && (
          <Avatar className="h-6 w-6">
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
              {issue.assignee.initials}
            </div>
          </Avatar>
        )}
      </div>
    </div>
  )
}
