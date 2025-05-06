"use client"

import type React from "react"

import { useState } from "react"
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
import { projects } from "@/data/projects"
import { users } from "@/data/users"

interface CreateIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateIssueDialog({ open, onOpenChange }: CreateIssueDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    priority: "Medium",
    sprint: "",
    labels: [] as string[],
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would dispatch an action to add the issue
    console.log("Creating new issue:", formData)

    // Reset form and close dialog
    setFormData({
      title: "",
      description: "",
      project: "",
      assignee: "",
      priority: "Medium",
      sprint: "",
      labels: [],
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Issue</DialogTitle>
            <DialogDescription>Add a new issue to your project. Fill out the details below.</DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Select value={formData.project} onValueChange={(value) => handleChange("project", value)} required>
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
            <div className="grid gap-2">
              <Label htmlFor="labels">Labels</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                  + Bug
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                  + Feature
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                  + Enhancement
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                  + Documentation
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Issue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
