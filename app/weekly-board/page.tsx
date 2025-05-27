"use client"

import { useState } from "react"
import { WeeklyBoardHeader } from "@/components/weekly-board/weekly-board-header"
import { WeeklyBoard } from "@/components/weekly-board/weekly-board"
import { AddTaskModal } from "@/components/weekly-board/add-task-modal"
import { EditTaskModal } from "@/components/weekly-board/edit-task-modal"
import { addWeeks, subWeeks } from "date-fns"

export interface Task {
  id: string
  title: string
  description?: string
  projectId?: string
  projectName?: string
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  hour: number // 0-23
  userId: string
  userName: string
  color?: string
  completed: boolean
}

export default function WeeklyBoardPage() {
  // State for the selected week (Monday of the week)
  const [selectedWeek, setSelectedWeek] = useState<Date>(() => {
    const now = new Date()
    const day = now.getDay() // 0 is Sunday, 1 is Monday, etc.
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    const monday = new Date(now)
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)
    return monday
  })

  // State for tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Generate some sample tasks
    const sampleTasks: Task[] = []
    const days: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"> = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ]

    const projects = [
      { id: "project-1", name: "Website Redesign", color: "bg-blue-100 border-blue-300 text-blue-800" },
      { id: "project-2", name: "Mobile App", color: "bg-green-100 border-green-300 text-green-800" },
      { id: "project-3", name: "API Development", color: "bg-purple-100 border-purple-300 text-purple-800" },
    ]

    for (let i = 0; i < 15; i++) {
      const day = days[Math.floor(Math.random() * days.length)]
      const hour = 9 + Math.floor(Math.random() * 8) // 9 AM to 5 PM
      const project = projects[Math.floor(Math.random() * projects.length)]

      sampleTasks.push({
        id: `task-${i}`,
        title: `Task ${i + 1}: ${project.name}`,
        description: `Working on ${project.name}`,
        projectId: project.id,
        projectName: project.name,
        day,
        hour,
        userId: "user-1",
        userName: "John Doe",
        color: project.color,
        completed: Math.random() > 0.7,
      })
    }

    return sampleTasks
  })

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedDayHour, setSelectedDayHour] = useState<{ day: Task["day"]; hour: number } | null>(null)

  // Navigation functions
  const goToPreviousWeek = () => {
    setSelectedWeek((prev) => {
      const newDate = new Date(prev)
      return subWeeks(newDate, 1)
    })
  }

  const goToNextWeek = () => {
    setSelectedWeek((prev) => {
      const newDate = new Date(prev)
      return addWeeks(newDate, 1)
    })
  }

  const goToCurrentWeek = () => {
    const now = new Date()
    const day = now.getDay() // 0 is Sunday, 1 is Monday, etc.
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    const monday = new Date(now)
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)
    setSelectedWeek(monday)
  }

  // Task management functions
  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    }
    setTasks((prev) => [...prev, newTask])
    setIsAddModalOpen(false)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setIsEditModalOpen(false)
    setSelectedTask(null)
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    setIsEditModalOpen(false)
    setSelectedTask(null)
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleAddTaskClick = (day?: Task["day"], hour?: number) => {
    if (day && hour !== undefined) {
      setSelectedDayHour({ day, hour })
    } else {
      setSelectedDayHour(null)
    }
    setIsAddModalOpen(true)
  }

  const handleEditTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  const handleTaskDrop = (taskId: string, newDay: Task["day"], newHour: number) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, day: newDay, hour: newHour } : task)))
  }

  return (
    <div className="space-y-6">
      <WeeklyBoardHeader
        selectedWeek={selectedWeek}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onCurrentWeek={goToCurrentWeek}
        onAddTask={() => handleAddTaskClick()}
      />

      <WeeklyBoard
        selectedWeek={selectedWeek}
        tasks={tasks}
        onAddTask={handleAddTaskClick}
        onEditTask={handleEditTaskClick}
        onToggleTaskCompletion={toggleTaskCompletion}
        onTaskDrop={handleTaskDrop}
      />

      {isAddModalOpen && (
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTask={addTask}
          initialDay={selectedDayHour?.day}
          initialHour={selectedDayHour?.hour}
        />
      )}

      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedTask(null)
          }}
          task={selectedTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      )}
    </div>
  )
}
