"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DraggableTaskList } from "./draggable-task-list"
import { AssignTaskToSprintDialog } from "./assign-task-to-sprint-dialog"
import { AssignTaskToUserDialog } from "./assign-task-to-user-dialog"
import { ViewTaskDialog } from "./view-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { MoveTaskDialog } from "./move-task-dialog"
import { DeleteTaskDialog } from "./delete-task-dialog"
import { updateTask } from "@/lib/redux/features/tasks-slice"
import type { RootState } from "@/lib/redux/store"

interface SprintDetailTasksProps {
  sprintId: string
}

export function SprintDetailTasks({ sprintId }: SprintDetailTasksProps) {
  const dispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks.tasks.filter((task) => task.sprintId === sprintId))

  const [assignTasksDialogOpen, setAssignTasksDialogOpen] = useState(false)
  const [viewTaskDialogOpen, setViewTaskDialogOpen] = useState(false)
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false)
  const [assignTaskDialogOpen, setAssignTaskDialogOpen] = useState(false)
  const [moveTaskDialogOpen, setMoveTaskDialogOpen] = useState(false)
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")

  const handleViewTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setViewTaskDialogOpen(true)
  }

  const handleEditTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setEditTaskDialogOpen(true)
  }

  const handleAssignTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setAssignTaskDialogOpen(true)
  }

  const handleMoveTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setMoveTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setDeleteTaskDialogOpen(true)
  }

  const handleReorderTasks = (reorderedTasks: any[]) => {
    // Update each task with its new order
    reorderedTasks.forEach((task, index) => {
      const updatedTask = {
        ...task,
        order: index,
        updatedAt: new Date().toISOString(),
      }
      dispatch(updateTask(updatedTask))
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Sprint Tasks</h3>
        <Button onClick={() => setAssignTasksDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Assign Tasks
        </Button>
      </div>

      <DraggableTaskList
        tasks={tasks}
        onView={handleViewTask}
        onEdit={handleEditTask}
        onAssign={handleAssignTask}
        onMove={handleMoveTask}
        onDelete={handleDeleteTask}
        onReorder={handleReorderTasks}
      />

      <AssignTaskToSprintDialog
        open={assignTasksDialogOpen}
        onOpenChange={setAssignTasksDialogOpen}
        sprintId={sprintId}
      />

      {selectedTaskId && (
        <>
          <ViewTaskDialog open={viewTaskDialogOpen} onOpenChange={setViewTaskDialogOpen} taskId={selectedTaskId} />

          <EditTaskDialog open={editTaskDialogOpen} onOpenChange={setEditTaskDialogOpen} taskId={selectedTaskId} />

          <AssignTaskToUserDialog
            open={assignTaskDialogOpen}
            onOpenChange={setAssignTaskDialogOpen}
            taskId={selectedTaskId}
            sprintId={sprintId}
          />

          <MoveTaskDialog open={moveTaskDialogOpen} onOpenChange={setMoveTaskDialogOpen} taskId={selectedTaskId} />

          <DeleteTaskDialog
            open={deleteTaskDialogOpen}
            onOpenChange={setDeleteTaskDialogOpen}
            taskId={selectedTaskId}
          />
        </>
      )}
    </div>
  )
}
