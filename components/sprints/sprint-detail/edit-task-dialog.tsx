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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateIssue } from "@/lib/redux/features/issues-slice"
import { tasks as dummyTasks } from "@/data/tasks"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
}

export function EditTaskDialog({ open, onOpenChange, taskId }: EditTaskDialogProps) {
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

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("task")
  const [status, setStatus] = useState("todo")
  const [priority, setPriority] = useState("medium")
  const [assignee, setAssignee] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setType(task.type)
      setStatus(task.status)
      setPriority(task.priority)
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
            title,
            description,
            type,
            status,
            priority,
            assignee,
            updatedAt: new Date().toISOString(),
          },
        }),
      )
    } else {
      // For demo purposes, we'll just close the dialog
      // In a real app, you would update the task in your data source
      console.log("Task updated:", {
        id: taskId,
        title,
        description,
        type,
        status,
        priority,
        assignee,
      })
    }

    onOpenChange(false)
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the details of this task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
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
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[var(--fixed-primary)] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
