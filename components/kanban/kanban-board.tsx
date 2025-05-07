"use client"

import { issues } from "@/data/issues"
import { useState, useEffect } from "react"
import KanbanColumn from "./kanban-column"
import type { Issue } from "@/types/issue"
import { Task } from "@/types/task"

export default function KanbanBoard() {
  const [todoIssues, setTodoIssues] = useState<Task[]>([])
  const [inProgressIssues, setInProgressIssues] = useState<Issue[]>([])
  const [doneIssues, setDoneIssues] = useState<Issue[]>([])

  useEffect(() => {
    // Filter issues by status
    const todo = issues.filter((issue) => issue.status === "to-do" || issue.status === "backlog")
    const inProgress = issues.filter((issue) => issue.status === "in-progress" || issue.status === "review")
    const done = issues.filter((issue) => issue.status === "done")

    setTodoIssues(todo)
    setInProgressIssues(inProgress)
    setDoneIssues(done)
  }, [])

  const handleDragEnd = (issueId: string, targetStatus: string) => {
    // Find the issue in all columns
    const issue = [...todoIssues, ...inProgressIssues, ...doneIssues].find((i) => i.id === issueId)

    if (!issue) return

    // Create a copy of the issue with updated status
    const updatedIssue = { ...issue, status: targetStatus }

    // Remove the issue from its current column
    setTodoIssues((prev) => prev.filter((i) => i.id !== issueId))
    setInProgressIssues((prev) => prev.filter((i) => i.id !== issueId))
    setDoneIssues((prev) => prev.filter((i) => i.id !== issueId))

    // Add the issue to the target column
    switch (targetStatus) {
      case "to-do":
        setTodoIssues((prev) => [...prev, updatedIssue])
        break
      case "in-progress":
        setInProgressIssues((prev) => [...prev, updatedIssue])
        break
      case "done":
        setDoneIssues((prev) => [...prev, updatedIssue])
        break
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full overflow-auto">
      <KanbanColumn
        title="To Do"
        issues={todoIssues}
        status="to-do"
        onDragEnd={handleDragEnd}
        className="bg-gray-50 dark:bg-gray-900"
      />
      <KanbanColumn
        title="In Progress"
        issues={inProgressIssues}
        status="in-progress"
        onDragEnd={handleDragEnd}
        className="bg-blue-50 dark:bg-blue-950"
      />
      <KanbanColumn
        title="Done"
        issues={doneIssues}
        status="done"
        onDragEnd={handleDragEnd}
        className="bg-green-50 dark:bg-green-950"
      />
    </div>
  )
}
