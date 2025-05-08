"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateTask } from "@/lib/redux/features/tasks-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Bug, Lightbulb, BookOpen, GitBranch } from "lucide-react"
import Link from "next/link"
import type { TaskType } from "@/types/task"

export default function EditTaskPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const taskId = params.id as string

  const task = useSelector((state: RootState) => state.tasks.tasks.find((t) => t.id === taskId))
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    priority: "Medium",
    status: "to-do",
    taskType: "feature" as TaskType,
    sprint: "",
    parentTask: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!task) {
      router.push("/tasks")
      return
    }

    setFormData({
      title: task.title,
      description: task.description,
      project: task.project,
      assignee: task.assignee.id,
      priority: task.priority,
      status: task.status,
      taskType: task.taskType,
      sprint: task.sprint || "",
      parentTask: task.parentTaskId || "",
    })
  }, [task, router])

  if (!task) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading task details...</p>
      </div>
    )
  }

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

    if (!validateForm()) return

    const selectedProject = projects.find((p) => p.id === formData.project)
    const selectedAssignee = users.find((user) => user.id === formData.assignee)
    const { title, description, project, assignee, priority, status, taskType, sprint, parentTask } = formData

    dispatch(
      updateTask({
        id: taskId,
        changes: {
          title,
          description,
          status,
          priority,
          taskType,
          project,
          projectName: selectedProject?.name || "",
          assignee: {
            id: assignee,
            name: selectedAssignee?.name || "",
            avatar: selectedAssignee?.avatar || "",
            initials: selectedAssignee?.initials || "",
          },
          sprint: sprint || undefined,
          parentTaskId: parentTask || undefined,
          updatedAt: new Date().toISOString(),
        },
      }),
    )

    router.push(`/tasks/${taskId}`)
  }

  // Get parent tasks for subtask selection
  const parentTaskOptions = allTasks.filter(
    (t) => t.id !== taskId && t.taskType !== "subtask" && (formData.project ? t.project === formData.project : true),
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">Edit Task</h1>
      </div>

      <Card className="fixed-card">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription className="text-[var(--fixed-sidebar-muted)]">
            Update the task information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
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
                  rows={5}
                  className="border-[var(--fixed-card-border)]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="taskType">Task Type</Label>
                <Select
                  value={formData.taskType}
                  onValueChange={(value) => handleChange("taskType", value as TaskType)}
                >
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
                      className={
                        errors.parentTask ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"
                      }
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

              <div className="grid grid-cols-3 gap-4">
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
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                asChild
              >
                <Link href={`/tasks/${taskId}`}>Cancel</Link>
              </Button>
              <Button type="submit" className="bg-[var(--fixed-primary)] text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
