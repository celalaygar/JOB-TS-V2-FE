"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateIssue } from "@/lib/redux/features/issues-slice"
import { tasks as dummyTasks } from "@/data/tasks"

interface AssignTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
}

export function AssignTaskDialog({ open, onOpenChange, taskId }: AssignTaskDialogProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)

  // First try to find the task in the Redux store
  const reduxIssue = useSelector((state: RootState) => state.issues.issues.find((issue) => issue.id === taskId))

  // If not found in Redux, look in the dummy tasks
  const dummyTask = dummyTasks.find((task) => task.id === taskId)

  // Combine the data sources
  const task =
    reduxIssue ||
    (dummyTask
      ? {
          id: dummyTask.id,
          title: dummyTask.title,
          description: dummyTask.description,
          type: dummyTask.taskType,
          status: dummyTask.status,
          priority: dummyTask.priority.toLowerCase(),
          assignee: dummyTask.assignee?.id,
          sprint: dummyTask.sprint,
        }
      : null)

  const [assignee, setAssignee] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (task) {
      setAssignee(task.assignee)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!task) return

    // If it's a Redux task, update it in Redux
    if (reduxIssue) {
      dispatch(
        updateIssue({
          id: taskId,
          changes: {
            assignee,
            updatedAt: new Date().toISOString(),
          },
        }),
      )
    } else {
      // For demo purposes, we'll just close the dialog
      // In a real app, you would update the task in your data source
      console.log("Task assigned:", {
        id: taskId,
        assignee,
      })
    }

    onOpenChange(false)
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>Assign this task to a team member.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium">Task</h3>
              <p className="text-sm text-muted-foreground">{task.title}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={assignee || "unassigned"}
                onValueChange={(value) => setAssignee(value === "unassigned" ? undefined : value)}
              >
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[var(--fixed-primary)] text-white">
              Assign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
