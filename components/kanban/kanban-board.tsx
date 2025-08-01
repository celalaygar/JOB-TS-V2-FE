"use client"

import { tasks } from "@/data/tasks"
import { useState, useEffect } from "react"
import KanbanColumn from "./kanban-column"
import type { Task } from "@/types/task"

export default function KanbanBoard() {
  const [todoTasks, setTodoTasks] = useState<Task[]>([])
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [reviewTasks, setReviewTasks] = useState<Task[]>([])

  useEffect(() => {
    // Filter tasks by status
    const todo = tasks.filter((task) => task.status === "to-do")
    const inProgress = tasks.filter((task) => task.status === "in-progress")
    const done = tasks.filter((task) => task.status === "done")
    const review = tasks.filter((task) => task.status === "review")

    setTodoTasks(todo)
    setInProgressTasks(inProgress)
    setDoneTasks(done)
    setReviewTasks(review)
  }, [])

  const handleDragEnd = (taskId: string, targetStatus: string) => {
    // Find the task in all columns
    const task = [...todoTasks, ...inProgressTasks, ...doneTasks, ...reviewTasks].find((t) => t.id === taskId)

    if (!task) return

    // Create a copy of the task with updated status
    const updatedTask = { ...task, status: targetStatus }

    // Remove the task from its current column
    setTodoTasks((prev) => prev.filter((t) => t.id !== taskId))
    setInProgressTasks((prev) => prev.filter((t) => t.id !== taskId))
    setDoneTasks((prev) => prev.filter((t) => t.id !== taskId))
    setReviewTasks((prev) => prev.filter((t) => t.id !== taskId))

    // Add the task to the target column
    switch (targetStatus) {
      case "to-do":
        setTodoTasks((prev) => [...prev, updatedTask])
        break
      case "in-progress":
        setInProgressTasks((prev) => [...prev, updatedTask])
        break
      case "done":
        setDoneTasks((prev) => [...prev, updatedTask])
        break
      case "review":
        setReviewTasks((prev) => [...prev, updatedTask])
        break
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 h-full overflow-auto">
      <KanbanColumn
        title="To Do"
        tasks={todoTasks}
        status="to-do"
        onDragEnd={handleDragEnd}
        className="bg-gray-50 dark:bg-gray-900"
      />
      <KanbanColumn
        title="In Progress"
        tasks={inProgressTasks}
        status="in-progress"
        onDragEnd={handleDragEnd}
        className="bg-blue-50 dark:bg-blue-950"
      />
      <KanbanColumn
        title="Review"
        tasks={reviewTasks}
        status="review"
        onDragEnd={handleDragEnd}
        className="bg-red-50 dark:bg-red-950"
      />
      <KanbanColumn
        title="Done"
        tasks={doneTasks}
        status="done"
        onDragEnd={handleDragEnd}
        className="bg-green-50 dark:bg-green-950"
      />
    </div>
  )
}
