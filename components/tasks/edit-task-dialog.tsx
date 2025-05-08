"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateTask } from "@/lib/redux/features/tasks-slice"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bug, Lightbulb, BookOpen, GitBranch } from "lucide-react"
import type { TaskType } from "@/types/task"

interface EditTaskDialogProps {
  taskId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({ taskId, open, onOpenChange }: EditTaskDialogProps) {
  const dispatch = useDispatch()
  const task = useSelector((state: RootState) => state.tasks.tasks.find((task) => task.id === taskId))
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    priority: "",
    taskType: "" as TaskType,
    status: "",
    sprint: "",
    parentTask: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        project: task.project,
        assignee: task.assignee.id,
        priority: task.priority,
        taskType: task.taskType,
        status: task.status,
        sprint: task.sprint || "",
        parentTask: task.parentTaskId || "",
      })
    }
  }, [task])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }

    if (!formData.project) {
      newErrors.project = "Project is required"
    }

    if (!formData.assignee) {
      newErrors.assignee = "Assignee is required"
    }

    if (formData.taskType === "subtask" && !formData.parentTask) {
      newErrors.parentTask = "Parent task is required for subtasks"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !task) return

    const assigneeUser = users.find((user) => user.id === formData.assignee)
    const projectObj = projects.find((p) => p.id === formData.project)

    dispatch(
      updateTask({
        id: taskId,
        changes: {
          title: formData.title,
          description: formData.description,
          project: formData.project,
          projectName: projectObj?.name || task.projectName,
          assignee: {
            id: assigneeUser?.id || "",
            name: assigneeUser?.name || "",
            avatar: assigneeUser?.avatar || "",
            initials: assigneeUser?.initials || "",
          },
          priority: formData.priority,
          taskType: formData.taskType,
          status: formData.status,
          sprint: formData.sprint || undefined,
          parentTaskId: formData.parentTask || undefined,
        },
      }),
    )

    onOpenChange(false)
  }

  // Get parent tasks for subtask selection
  const parentTaskOptions = allTasks.filter(
    (t) =>
      t.id !== taskId && // Can't be parent of itself
      t.taskType !== "subtask" &&
      (formData.project ? t.project === formData.project : true),
  )

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
              <Label htmlFor="title" className={errors.title ? "text-[var(--fixed-danger)]" : ""}>
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title"
                className={errors.title ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.title && <p className="text-xs text-[var(--fixed-danger)]">{errors.title}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the task in detail"
                rows={3}
                className="border-[var(--fixed-card-border)]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taskType">Task Type</Label>
              <Select value={formData.taskType} onValueChange={(value) => handleChange("taskType", value as TaskType)}>
                <SelectTrigger id="taskType" className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">
                    <div className="flex items-center">
                      <Bug className="mr-2 h-4 w-4 text-red-500" />
                      Bug
                    </div>
                  </SelectItem>
                  <SelectItem value="feature">
                    <div className="flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4 text-blue-500" />
                      Feature
                    </div>
                  </SelectItem>
                  <SelectItem value="story">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-purple-500" />
                      Story
                    </div>
                  </SelectItem>
                  <SelectItem value="subtask">
                    <div className="flex items-center">
                      <GitBranch className="mr-2 h-4 w-4 text-gray-500" />
                      Subtask
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.taskType === "subtask" && (
              <div className="grid gap-2">
                <Label htmlFor="parentTask" className={errors.parentTask ? "text-[var(--fixed-danger)]" : ""}>
                  Parent Task
                </Label>
                <Select value={formData.parentTask} onValueChange={(value) => handleChange("parentTask", value)}>
                  <SelectTrigger
                    id="parentTask"
                    className={errors.parentTask ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
                  >
                    <SelectValue placeholder="Select parent task" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentTaskOptions.map((parentTask) => (
                      <SelectItem key={parentTask.id} value={parentTask.id}>
                        {parentTask.taskNumber} - {parentTask.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.parentTask && <p className="text-xs text-[var(--fixed-danger)]">{errors.parentTask}</p>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project" className={errors.project ? "text-[var(--fixed-danger)]" : ""}>
                  Project
                </Label>
                <Select value={formData.project} onValueChange={(value) => handleChange("project", value)}>
                  <SelectTrigger
                    id="project"
                    className={errors.project ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
                  >
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.project && <p className="text-xs text-[var(--fixed-danger)]">{errors.project}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee" className={errors.assignee ? "text-[var(--fixed-danger)]" : ""}>
                  Assignee
                </Label>
                <Select value={formData.assignee} onValueChange={(value) => handleChange("assignee", value)}>
                  <SelectTrigger
                    id="assignee"
                    className={errors.assignee ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
                  >
                    <SelectValue placeholder="Assign to" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignee && <p className="text-xs text-[var(--fixed-danger)]">{errors.assignee}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                  <SelectTrigger id="priority" className="border-[var(--fixed-card-border)]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status" className="border-[var(--fixed-card-border)]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-do">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sprint">Sprint</Label>
              <Select value={formData.sprint} onValueChange={(value) => handleChange("sprint", value)}>
                <SelectTrigger id="sprint" className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="Select sprint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Sprint</SelectItem>
                  <SelectItem value="next">Next Sprint</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            >
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
