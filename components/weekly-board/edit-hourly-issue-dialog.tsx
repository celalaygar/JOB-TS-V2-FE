"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateHourlyIssue, type HourlyIssue } from "@/lib/redux/features/weekly-board-slice"
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
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

interface EditHourlyIssueDialogProps {
  issue: HourlyIssue
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditHourlyIssueDialog({ issue, open, onOpenChange }: EditHourlyIssueDialogProps) {
  const dispatch = useDispatch()
  const projects = useSelector((state: RootState) => state.projects.projects)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    day: "monday",
    hour: 9,
    completed: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with issue data
  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description || "",
        projectId: issue.projectId || "",
        day: issue.day,
        hour: issue.hour,
        completed: issue.completed,
      })
    }
  }, [issue])

  const handleChange = (field: string, value: string | number | boolean) => {
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
      newErrors.title = "Title is required"
    }

    if (!formData.projectId) {
      newErrors.projectId = "Project is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const selectedProject = projects.find((p) => p.id === formData.projectId)

    dispatch(
      updateHourlyIssue({
        id: issue.id,
        changes: {
          title: formData.title,
          description: formData.description,
          projectId: formData.projectId,
          projectName: selectedProject?.name,
          day: formData.day as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
          hour: formData.hour,
          completed: formData.completed,
        },
      }),
    )

    onOpenChange(false)
  }

  // Days of the week
  const days = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ]

  // Working hours (9 AM to 6 PM)
  const hours = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9
    return {
      value: hour,
      label: format(new Date().setHours(hour, 0, 0, 0), "h:00 a"),
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the details of your task.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className={errors.title ? "text-[var(--fixed-danger)]" : ""}>
                Task Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={errors.title ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.title && <p className="text-xs text-[var(--fixed-danger)]">{errors.title}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="border-[var(--fixed-card-border)]"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project" className={errors.projectId ? "text-[var(--fixed-danger)]" : ""}>
                Project
              </Label>
              <Select value={formData.projectId} onValueChange={(value) => handleChange("projectId", value)}>
                <SelectTrigger
                  id="project"
                  className={errors.projectId ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
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
              {errors.projectId && <p className="text-xs text-[var(--fixed-danger)]">{errors.projectId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="day">Day</Label>
                <Select value={formData.day} onValueChange={(value) => handleChange("day", value)}>
                  <SelectTrigger id="day" className="border-[var(--fixed-card-border)]">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hour">Time</Label>
                <Select
                  value={formData.hour.toString()}
                  onValueChange={(value) => handleChange("hour", Number.parseInt(value))}
                >
                  <SelectTrigger id="hour" className="border-[var(--fixed-card-border)]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour.value} value={hour.value.toString()}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={formData.completed}
                onCheckedChange={(checked) => handleChange("completed", !!checked)}
              />
              <Label htmlFor="completed">Mark as completed</Label>
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
