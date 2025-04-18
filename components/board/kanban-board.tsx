"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateTask } from "@/lib/redux/features/tasks-slice"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TaskDetailsDialog } from "@/components/tasks/task-details-dialog"
import { Bug, Lightbulb, BookOpen, GitBranch } from "lucide-react"
import type { TaskType } from "@/types/task"

interface KanbanBoardProps {
  filters?: {
    search: string
    project: string
    priority: string
    assignee: string
    taskType: string
  }
}

export function KanbanBoard({ filters }: KanbanBoardProps) {
  const dispatch = useDispatch()
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // Default filters if not provided
  const activeFilters = filters || {
    search: "",
    project: "all",
    priority: "all",
    assignee: "all",
    taskType: "all",
  }

  // Filter tasks based on the current filters
  const filteredTasks = allTasks.filter((task) => {
    // Search filter
    const matchesSearch =
      activeFilters.search === "" ||
      task.title.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(activeFilters.search.toLowerCase())

    // Project filter
    const matchesProject = activeFilters.project === "all" || task.project === activeFilters.project

    // Priority filter
    const matchesPriority = activeFilters.priority === "all" || task.priority === activeFilters.priority

    // Assignee filter
    const matchesAssignee = activeFilters.assignee === "all" || task.assignee.id === activeFilters.assignee

    // Task Type filter
    const matchesTaskType = activeFilters.taskType === "all" || task.taskType === activeFilters.taskType

    return matchesSearch && matchesProject && matchesPriority && matchesAssignee && matchesTaskType
  })

  // Group tasks by status
  const columns = {
    "to-do": filteredTasks.filter((task) => task.status === "to-do"),
    "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
    review: filteredTasks.filter((task) => task.status === "review"),
    done: filteredTasks.filter((task) => task.status === "done"),
  }

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place, do nothing
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Update the task status based on the destination column
    const taskId = draggableId
    const newStatus = destination.droppableId

    dispatch(
      updateTask({
        id: taskId,
        changes: { status: newStatus },
      }),
    )
  }

  const getTaskTypeIcon = (taskType: TaskType) => {
    switch (taskType) {
      case "bug":
        return <Bug className="h-4 w-4 text-red-500" />
      case "feature":
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "story":
        return <BookOpen className="h-4 w-4 text-purple-500" />
      case "subtask":
        return <GitBranch className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* To Do Column */}
          <Droppable droppableId="to-do">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col h-full">
                <Card className="flex-1 fixed-card">
                  <CardHeader className="bg-[var(--fixed-secondary)] py-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>To Do</span>
                      <Badge variant="outline">{columns["to-do"].length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 overflow-y-auto max-h-[calc(100vh-220px)]">
                    {columns["to-do"].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {task.taskNumber}
                                  </Badge>
                                  <div className="flex items-center gap-1 ml-auto">
                                    {getTaskTypeIcon(task.taskType)}
                                  </div>
                                </div>
                                <h3 className="font-medium text-sm mb-2">{task.title}</h3>
                                <div className="flex items-center justify-between">
                                  <Badge
                                    className={
                                      task.priority === "High"
                                        ? "bg-[var(--fixed-danger)] text-white"
                                        : task.priority === "Medium"
                                          ? "bg-[var(--fixed-warning)] text-white"
                                          : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                                    }
                                  >
                                    {task.priority}
                                  </Badge>
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={task.assignee.avatar || "/placeholder.svg"}
                                      alt={task.assignee.name}
                                    />
                                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                  </Avatar>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns["to-do"].length === 0 && (
                      <div className="text-center py-4 text-[var(--fixed-sidebar-muted)]">
                        <p>No tasks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>

          {/* In Progress Column */}
          <Droppable droppableId="in-progress">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col h-full">
                <Card className="flex-1 fixed-card">
                  <CardHeader className="bg-[var(--fixed-secondary)] py-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>In Progress</span>
                      <Badge variant="outline">{columns["in-progress"].length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 overflow-y-auto max-h-[calc(100vh-220px)]">
                    {columns["in-progress"].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {task.taskNumber}
                                  </Badge>
                                  <div className="flex items-center gap-1 ml-auto">
                                    {getTaskTypeIcon(task.taskType)}
                                  </div>
                                </div>
                                <h3 className="font-medium text-sm mb-2">{task.title}</h3>
                                <div className="flex items-center justify-between">
                                  <Badge
                                    className={
                                      task.priority === "High"
                                        ? "bg-[var(--fixed-danger)] text-white"
                                        : task.priority === "Medium"
                                          ? "bg-[var(--fixed-warning)] text-white"
                                          : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                                    }
                                  >
                                    {task.priority}
                                  </Badge>
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={task.assignee.avatar || "/placeholder.svg"}
                                      alt={task.assignee.name}
                                    />
                                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                  </Avatar>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns["in-progress"].length === 0 && (
                      <div className="text-center py-4 text-[var(--fixed-sidebar-muted)]">
                        <p>No tasks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>

          {/* Review Column */}
          <Droppable droppableId="review">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col h-full">
                <Card className="flex-1 fixed-card">
                  <CardHeader className="bg-[var(--fixed-secondary)] py-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>In Review</span>
                      <Badge variant="outline">{columns["review"].length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 overflow-y-auto max-h-[calc(100vh-220px)]">
                    {columns["review"].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {task.taskNumber}
                                  </Badge>
                                  <div className="flex items-center gap-1 ml-auto">
                                    {getTaskTypeIcon(task.taskType)}
                                  </div>
                                </div>
                                <h3 className="font-medium text-sm mb-2">{task.title}</h3>
                                <div className="flex items-center justify-between">
                                  <Badge
                                    className={
                                      task.priority === "High"
                                        ? "bg-[var(--fixed-danger)] text-white"
                                        : task.priority === "Medium"
                                          ? "bg-[var(--fixed-warning)] text-white"
                                          : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                                    }
                                  >
                                    {task.priority}
                                  </Badge>
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={task.assignee.avatar || "/placeholder.svg"}
                                      alt={task.assignee.name}
                                    />
                                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                  </Avatar>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns["review"].length === 0 && (
                      <div className="text-center py-4 text-[var(--fixed-sidebar-muted)]">
                        <p>No tasks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>

          {/* Done Column */}
          <Droppable droppableId="done">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col h-full">
                <Card className="flex-1 fixed-card">
                  <CardHeader className="bg-[var(--fixed-secondary)] py-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>Done</span>
                      <Badge variant="outline">{columns["done"].length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 overflow-y-auto max-h-[calc(100vh-220px)]">
                    {columns["done"].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {task.taskNumber}
                                  </Badge>
                                  <div className="flex items-center gap-1 ml-auto">
                                    {getTaskTypeIcon(task.taskType)}
                                  </div>
                                </div>
                                <h3 className="font-medium text-sm mb-2">{task.title}</h3>
                                <div className="flex items-center justify-between">
                                  <Badge
                                    className={
                                      task.priority === "High"
                                        ? "bg-[var(--fixed-danger)] text-white"
                                        : task.priority === "Medium"
                                          ? "bg-[var(--fixed-warning)] text-white"
                                          : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                                    }
                                  >
                                    {task.priority}
                                  </Badge>
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={task.assignee.avatar || "/placeholder.svg"}
                                      alt={task.assignee.name}
                                    />
                                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                  </Avatar>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns["done"].length === 0 && (
                      <div className="text-center py-4 text-[var(--fixed-sidebar-muted)]">
                        <p>No tasks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* Task Details Dialog */}
      <TaskDetailsDialog
        taskId={selectedTaskId}
        open={!!selectedTaskId}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
      />
    </>
  )
}
