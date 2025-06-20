"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { SprintDetailHeader } from "@/components/sprints/sprint-detail/sprint-detail-header"
import { DraggableTaskList } from "@/components/sprints/sprint-detail/draggable-task-list"
import { AddTaskDialog } from "@/components/sprints/sprint-detail/add-task-dialog"
import { ViewTaskDialog } from "@/components/sprints/sprint-detail/view-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { AssignTaskDialog } from "@/components/sprints/sprint-detail/assign-task-dialog"
import { MoveTaskDialog } from "@/components/sprints/sprint-detail/move-task-dialog"
import { DeleteTaskDialog } from "@/components/sprints/sprint-detail/delete-task-dialog"
import { CompleteSprintDialog } from "@/components/sprints/sprint-detail/complete-sprint-dialog"
import { AssignTaskToSprintDialog } from "@/components/sprints/sprint-detail/assign-task-to-sprint-dialog"
import { updateIssue } from "@/lib/redux/features/issues-slice"
import { SprintDetailStats } from "@/components/sprints/sprint-detail/sprint-detail-stats"
import { SprintDetailFilters } from "@/components/sprints/sprint-detail/sprint-detail-filters"
import { SprintDetailEmpty } from "@/components/sprints/sprint-detail/sprint-detail-empty"
import { tasks as dummyTasks } from "@/data/tasks"

export default function SprintDetailPage() {
  const params = useParams()
  const sprintId = params.id as string
  const dispatch = useDispatch()

  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))

  // Use dummy tasks data
  const tasks = dummyTasks.filter((task) => task.sprint === "current" || task.sprint === sprintId)

  // Map tasks to the format expected by SprintDetailTasks
  const mappedTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    type: task.taskType,
    status: task.status,
    priority: task.priority.toLowerCase(),
    assignee: task.assignee?.id,
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: task.updatedAt || new Date().toISOString(),
  }))

  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isViewTaskDialogOpen, setIsViewTaskDialogOpen] = useState(false)
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)
  const [isAssignTaskDialogOpen, setIsAssignTaskDialogOpen] = useState(false)
  const [isMoveTaskDialogOpen, setIsMoveTaskDialogOpen] = useState(false)
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false)
  const [isCompleteSprintDialogOpen, setIsCompleteSprintDialogOpen] = useState(false)
  const [isAssignTaskToSprintDialogOpen, setIsAssignTaskToSprintDialogOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")

  if (!sprint) {
    return <div className="p-6">Sprint not found</div>
  }

  const sprintTasks = mappedTasks

  return (
    <div className="space-y-6">
      <SprintDetailHeader
        sprint={sprint}
        onAddTask={() => setIsAddTaskDialogOpen(true)}
        onCompleteSprint={() => setIsCompleteSprintDialogOpen(true)}
        onAssignTasksToSprint={() => setIsAssignTaskToSprintDialogOpen(true)}
      />

      <SprintDetailStats sprint={sprint} tasks={mappedTasks} />

      {mappedTasks.length > 0 ? (
        <>
          <SprintDetailFilters />
          <DraggableTaskList
            tasks={sprintTasks}
            onView={(id) => {
              setSelectedTaskId(id)
              setIsViewTaskDialogOpen(true)
            }}
            onEdit={(id) => {
              setSelectedTaskId(id)
              setIsEditTaskDialogOpen(true)
            }}
            onAssign={(id) => {
              setSelectedTaskId(id)
              setIsAssignTaskDialogOpen(true)
            }}
            onMove={(id) => {
              setSelectedTaskId(id)
              setIsMoveTaskDialogOpen(true)
            }}
            onDelete={(id) => {
              setSelectedTaskId(id)
              setIsDeleteTaskDialogOpen(true)
            }}
            onReorder={(tasks) => {
              // Update task order in Redux
              tasks.forEach((task, index) => {
                dispatch(
                  updateIssue({
                    id: task.id,
                    changes: {
                      order: index,
                      updatedAt: new Date().toISOString(),
                    },
                  }),
                )
              })
            }}
          />
        </>
      ) : (
        <SprintDetailEmpty onAddTask={() => setIsAddTaskDialogOpen(true)} />
      )}

      {/* Dialogs */}
      <AddTaskDialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen} sprintId={sprintId} />

      <ViewTaskDialog open={isViewTaskDialogOpen} onOpenChange={setIsViewTaskDialogOpen} taskId={selectedTaskId} />

      <EditTaskDialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen} taskId={selectedTaskId} />

      <AssignTaskDialog
        open={isAssignTaskDialogOpen}
        onOpenChange={setIsAssignTaskDialogOpen}
        taskId={selectedTaskId}
      />

      <MoveTaskDialog open={isMoveTaskDialogOpen} onOpenChange={setIsMoveTaskDialogOpen} taskId={selectedTaskId} />

      <DeleteTaskDialog
        open={isDeleteTaskDialogOpen}
        onOpenChange={setIsDeleteTaskDialogOpen}
        taskId={selectedTaskId}
      />

      <CompleteSprintDialog
        open={isCompleteSprintDialogOpen}
        onOpenChange={setIsCompleteSprintDialogOpen}
        sprintId={sprintId}
      />

      <AssignTaskToSprintDialog
        open={isAssignTaskToSprintDialogOpen}
        onOpenChange={setIsAssignTaskToSprintDialogOpen}
        sprintId={sprintId}
      />
    </div>
  )
}
