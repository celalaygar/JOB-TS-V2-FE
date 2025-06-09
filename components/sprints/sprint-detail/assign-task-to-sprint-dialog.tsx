"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { updateTask } from "@/lib/redux/features/tasks-slice"
import type { RootState } from "@/lib/redux/store"

interface AssignTaskToSprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sprintId: string
}

export function AssignTaskToSprintDialog({ open, onOpenChange, sprintId }: AssignTaskToSprintDialogProps) {
  const dispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const users = useSelector((state: RootState) => state.users.users)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])

  // Get backlog tasks (tasks not assigned to any sprint)
  const backlogTasks = tasks.filter((task) => !task.sprintId && task.status !== "done")

  // Filter tasks based on search query
  const filteredTasks = backlogTasks.filter((task) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.id.toLowerCase().includes(query)
    )
  })

  const handleToggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleAssignTasks = () => {
    if (selectedTaskIds.length === 0) return

    // Update each selected task with the sprint ID
    selectedTaskIds.forEach((taskId) => {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        const updatedTask = {
          ...task,
          sprintId,
          updatedAt: new Date().toISOString(),
        }
        dispatch(updateTask(updatedTask))
      }
    })

    // Reset and close
    setSelectedTaskIds([])
    onOpenChange(false)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "todo":
      case "to-do":
        return "bg-slate-500"
      case "in-progress":
        return "bg-blue-500"
      case "review":
        return "bg-purple-500"
      case "done":
        return "bg-green-500"
      case "blocked":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-slate-500"
      case "medium":
        return "bg-blue-500"
      case "high":
        return "bg-amber-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "bug":
        return "bg-red-500"
      case "feature":
        return "bg-green-500"
      case "task":
        return "bg-blue-500"
      case "improvement":
        return "bg-purple-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Tasks to Sprint</DialogTitle>
          <DialogDescription>Select tasks from the backlog to add to this sprint.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Tasks</Label>
            <Input
              id="search"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="space-y-1 p-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const assignedUser = task.assignee ? users.find((u) => u.id === task.assignee) : null

                  return (
                    <div
                      key={task.id}
                      className={`flex items-start space-x-3 rounded-md p-3 ${
                        selectedTaskIds.includes(task.id) ? "bg-primary/10" : "hover:bg-muted"
                      }`}
                    >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={selectedTaskIds.includes(task.id)}
                        onCheckedChange={() => handleToggleTask(task.id)}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <Label htmlFor={`task-${task.id}`} className="cursor-pointer font-medium">
                            {task.title}
                          </Label>
                          <div className="flex items-center space-x-2">
                            {task.type && (
                              <Badge className={`${getTypeColor(task.type)} text-white`}>
                                {task.type?.charAt(0).toUpperCase() + task.type?.slice(1)}
                              </Badge>
                            )}
                            {task.priority && (
                              <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                                {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {task.status && (
                              <Badge className={`${getStatusColor(task.status)} text-white`}>
                                {task.status === "todo"
                                  ? "To Do"
                                  : task.status === "in-progress"
                                    ? "In Progress"
                                    : task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                              </Badge>
                            )}
                            {task.storyPoints && (
                              <Badge variant="outline" className="bg-background">
                                {task.storyPoints} {task.storyPoints === 1 ? "point" : "points"}
                              </Badge>
                            )}
                          </div>
                          {assignedUser && (
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={assignedUser.avatar || "/placeholder.svg"} alt={assignedUser.name} />
                                <AvatarFallback>{assignedUser.name?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{assignedUser.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex h-full items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground">No backlog tasks found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-sm">
            {selectedTaskIds.length} {selectedTaskIds.length === 1 ? "task" : "tasks"} selected
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTasks} disabled={selectedTaskIds.length === 0}>
              Assign to Sprint
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
