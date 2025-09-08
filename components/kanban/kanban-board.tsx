"use client"

import { useState, useEffect } from "react"
import KanbanColumn from "./kanban-column"
import type { ProjectTask, Task, TaskResponse } from "@/types/task"
import { KanbanFilterRequest } from "@/types/kanban"
import { ProjectTaskStatus } from "@/types/project"
import { updateProjectTaskStatusHelper } from "@/lib/service/api-helpers"
import { ProjectTaskStatusRequest } from "@/types/project-task-status"
import { useDispatch, useSelector } from "react-redux"
import { updateTask } from "@/lib/redux/features/tasks-slice"
import { RootState } from "@/lib/redux/store"
import { useLanguage } from "@/lib/i18n/context"




interface KanbanBoardProps {
  taskResponse: TaskResponse | null
  loading: boolean
  fetchData: () => void
  filters: KanbanFilterRequest
  projectTaskStatus: ProjectTaskStatus[] | null
}


export default function KanbanBoard({
  taskResponse,
  loading,
  fetchData,
  filters,
  projectTaskStatus
}: KanbanBoardProps) {
  const [loadingKanbanBoard, setLoadingKanbanBoard] = useState(false)
  const [statusTasks, setStatusTasks] = useState<{ [key: string]: ProjectTask[] }>({})
  const dispatch = useDispatch()
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)

  useEffect(() => {
    if (!!allTasks && allTasks.length > 0 && projectTaskStatus && projectTaskStatus.length > 0) {
      const newStatusTasks: { [key: string]: ProjectTask[] } = {}
      projectTaskStatus.forEach((status) => {
        newStatusTasks[status.id] = allTasks.filter(
          (task: ProjectTask) => task.projectTaskStatus.id === status.id
        )
      })
      setStatusTasks(newStatusTasks)
    }
  }, [allTasks, projectTaskStatus])

  const handleDragEnd = async (taskId: string, targetStatus: string) => {
    // Find the task in all columns 

    const filteredTasks = taskResponse?.content || []
    if (!taskId) return
    const selectedTask: ProjectTask | null = filteredTasks.find((task: ProjectTask) => task.id === taskId) || null

    if (!selectedTask) return
    let body: ProjectTaskStatusRequest = {
      projectTaskId: selectedTask.id,
      projectTaskStatusId: targetStatus,
      projectId: selectedTask.createdProject.id,
      projectTaskStatusName: undefined,
      projectTaskName: undefined
    }
    const response: ProjectTask | null = await updateProjectTaskStatusHelper(body, { setLoading: setLoadingKanbanBoard })
    if (response) {
      dispatch(updateTask(response))
      //fetchData()
    }
    return;
  }

  const getKanbanColumnClassName = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gray-50 dark:bg-gray-900"
      case 1:
        return "bg-blue-50 dark:bg-blue-950"
      case 2:
        return "bg-red-50 dark:bg-red-950"
      case 3:
        return "bg-green-50 dark:bg-green-950"
      case 4:
        return "bg-yellow-50 dark:bg-yellow-950"
      case 5:
        return "bg-purple-50 dark:bg-purple-950"
      default:
        return ""
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 h-full overflow-auto">

      <>
        {projectTaskStatus && projectTaskStatus.length > 0 && projectTaskStatus.map((status: ProjectTaskStatus, index: number) => {
          const tasksForStatus = statusTasks[status.id] || []
          return (
            <KanbanColumn
              key={status.id}
              title={status.name}
              tasks={tasksForStatus}
              status={status.id}
              onDragEnd={handleDragEnd}
              className={getKanbanColumnClassName(index)}
            //className="bg-blue-50 dark:bg-blue-950"
            />
          )
        }
        )}
      </>
    </div>
  )
}
