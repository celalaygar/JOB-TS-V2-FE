"use client"

import type React from "react"

import type { Issue } from "@/types/issue"
import KanbanCard from "./kanban-card"

interface KanbanColumnProps {
  title: string
  issues: Issue[]
  status: string
  onDragEnd: (issueId: string, targetStatus: string) => void
  className?: string
}

export default function KanbanColumn({ title, issues, status, onDragEnd, className }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-dashed", "border-primary")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("border-dashed", "border-primary")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-dashed", "border-primary")

    const issueId = e.dataTransfer.getData("text/plain")
    onDragEnd(issueId, status)
  }

  return (
    <div
      className={`flex flex-col h-full rounded-lg border ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-3 border-b font-medium flex items-center justify-between">
        <h3>{title}</h3>
        <span className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">{issues.length}</span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {issues.map((issue) => (
          <KanbanCard key={issue.id} issue={issue} />
        ))}
        {issues.length === 0 && (
          <div className="flex items-center justify-center h-24 border border-dashed rounded-lg text-muted-foreground">
            No issues
          </div>
        )}
      </div>
    </div>
  )
}
