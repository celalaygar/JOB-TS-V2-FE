"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/board/kanban-board"
import { BoardHeader } from "@/components/board/board-header"

export default function BoardPage() {
  const [filters, setFilters] = useState({
    search: "",
    project: "all",
    priority: "all",
    assignee: "all",
    taskType: "all",
  })

  return (
    <div className="space-y-6 p-6">
      <BoardHeader filters={filters} setFilters={setFilters} />
      <KanbanBoard filters={filters} />
    </div>
  )
}
