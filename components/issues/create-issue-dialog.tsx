"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addIssue } from "@/lib/redux/features/issues-slice"
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
import type { Issue } from "@/lib/redux/features/issues-slice"
import type { TaskType } from "@/types/issue"

interface CreateIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentIssueId?: string
}

export function CreateIssueDialog({ open, onOpenChange, parentIssueId }: CreateIssueDialogProps) {
  const dispatch = useDispatch()
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)
  const allIssues = useSelector((state: RootState) => state.issues.issues)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    priority: "Medium",
    taskType: "feature" as TaskType,
    sprint: "",
    parentIssue: parentIssueId || "",
  })

  // If parentIssueId is provided, pre-fill project from parent issue
  useEffect(() => {
    if (parentIssueId) {
      const parentIssue = allIssues.find((issue) => issue.id === parentIssueId)
      if (parentIssue) {
        setFormData((prev) => ({
          ...prev,
          project: parentIssue.project,
          taskType: "subtask",
          parentIssue: parentIssueId,
        }))
      }
    }
  }, [parentIssueId, allIssues])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedProject = projects.find((p) => p.id === formData.project)
    const selectedAssignee = users.find((user) => user.id === formData.assignee)
    const { title, description, project, assignee, priority, taskType, sprint, parentIssue } = formData

    // Generate a prefix based on task type
    let prefix = ""
    switch (taskType) {
      case "bug":
        prefix = "BUG"
        break
      case "feature":
        prefix = "FTR"
        break
      case "story":
        prefix = "STORY"
        break
      case "subtask":
        prefix = "SUB"
        break
      default:
        prefix = "PBI"
    }

    const randomNumber = Math.floor(Math.random() * 10000)
    const issueNumber = `${prefix}-${randomNumber}`

    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      issueNumber,
      title,
      description,
      status: "to-do",
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
      createdAt: new Date().toISOString(),
      comments: [],
      parentIssueId: parentIssue || undefined,
    }

    dispatch(addIssue(newIssue))

    onOpenChange(false)
    setFormData({
      title: "",
      description: "",
      project: "",
      assignee: "",
      priority: "Medium",
      taskType: "feature",
      sprint: "",
      parentIssue: "",
    })
  }

  // Get parent issues for subtask selection
  const parentIssueOptions = allIssues.filter(
    (issue) => issue.taskType !== "subtask" && (formData.project ? issue.project === formData.project : true),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your project. Fill out the details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter issue title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the issue in detail"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taskType">Task Type</Label>
              <Select value={formData.taskType} onValueChange={(value) => handleChange("taskType", value)}>
                <SelectTrigger id="taskType">
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
                <Label htmlFor="parentIssue">Parent Issue</Label>
                <Select
                  value={formData.parentIssue}
                  onValueChange={(value) => handleChange("parentIssue", value)}
                  disabled={!!parentIssueId}
                  required={formData.taskType === "subtask"}
                >
                  <SelectTrigger id="parentIssue">
                    <SelectValue placeholder="Select parent issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentIssueOptions.map((issue) => (
                      <SelectItem key={issue.id} value={issue.id}>
                        {issue.issueNumber} - {issue.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Select
                  value={formData.project}
                  onValueChange={(value) => handleChange("project", value)}
                  required
                  disabled={!!parentIssueId}
                >
                  <SelectTrigger id="project">
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select value={formData.assignee} onValueChange={(value) => handleChange("assignee", value)} required>
                  <SelectTrigger id="assignee">
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
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                  <SelectTrigger id="priority">
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
                  <SelectTrigger id="sprint">
                    <SelectValue placeholder="Select sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Sprint</SelectItem>
                    <SelectItem value="next">Next Sprint</SelectItem>
                    <SelectItem value="backlog">Backlog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
