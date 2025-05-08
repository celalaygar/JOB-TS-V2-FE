"use client"

import { useState } from "react"
import { TasksHeader } from "@/components/tasks/tasks-header"
import { TasksTable } from "@/components/tasks/tasks-table"

export default function TasksPage() {
  const [filters, setFilters] = useState({
    search: "",
    project: "all",
    status: "all",
    priority: "all",
    assignee: "all",
    taskType: "all",
  })

  return (
    <div className="container mx-auto py-6">
      <TasksHeader filters={filters} setFilters={setFilters} />
      <TasksTable filters={filters} />
    </div>
  )
}
