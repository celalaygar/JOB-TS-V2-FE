"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateIssue } from "@/lib/redux/features/issues-slice"
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
import type { TaskType } from "@/types/issue"

interface EditIssueDialogProps {
  issueId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditIssueDialog({ issueId, open, onOpenChange }: EditIssueDialogProps) {
  const dispatch = useDispatch()
  const issue = useSelector((state: RootState) => state.issues.issues.find((i) => i.id === issueId))
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)
  const allIssues = useSelector((state: RootState) => state.issues.issues)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    priority: "Medium",
    status: "to-do",
    taskType: "feature" as TaskType,
    sprint: "",
    parentIssue: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with issue data
  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description,
        project: issue.project,
        assignee: issue.assignee.id,
        priority: issue.priority,
        status: issue.status,
        taskType: issue.taskType,
        sprint: issue.sprint || "",
        parentIssue: issue.parentIssueId || "",
      })
    }
  }, [issue])

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
      newErrors.title = "Issue title is required"
    }

    if (!formData.project) {
      newErrors.project = "Project is required"
    }

    if (!formData.assignee) {
      newErrors.assignee = "Assignee is required"
    }

    if (formData.taskType === "subtask" && !formData.parentIssue) {
      newErrors.parentIssue = "Parent issue is required for subtasks"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!issue) return

    const selectedProject = projects.find((p) => p.id === formData.project)
    const selectedAssignee = users.find((user) => user.id === formData.assignee)
    const { title, description, project, assignee, priority, status, taskType, sprint, parentIssue } = formData

    dispatch(
      updateIssue({
        id: issueId,
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
          parentIssueId: parentIssue || undefined,
        },
      }),
    )

    onOpenChange(false)
  }

  // Get parent issues for subtask selection
  const parentIssueOptions = allIssues.filter(
    (i) => i.id !== issueId && i.taskType !== "subtask" && (formData.project ? i.project === formData.project : true),
  )

  if (!issue) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details below.</DialogDescription>
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
                placeholder="Enter issue title"
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
                placeholder="Describe the issue in detail"
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
                <Label htmlFor="parentIssue" className={errors.parentIssue ? "text-[var(--fixed-danger)]" : ""}>
                  Parent Issue
                </Label>
                <Select value={formData.parentIssue} onValueChange={(value) => handleChange("parentIssue", value)}>
                  <SelectTrigger
                    id="parentIssue"
                    className={
                      errors.parentIssue ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"
                    }
                  >
                    <SelectValue placeholder="Select parent issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentIssueOptions.map((parentIssue) => (
                      <SelectItem key={parentIssue.id} value={parentIssue.id}>
                        {parentIssue.issueNumber} - {parentIssue.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.parentIssue && <p className="text-xs text-[var(--fixed-danger)]">{errors.parentIssue}</p>}
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
              Update Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
