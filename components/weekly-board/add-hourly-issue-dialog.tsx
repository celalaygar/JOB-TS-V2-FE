"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addHourlyIssue } from "@/lib/redux/features/weekly-board-slice"
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
import { format } from "date-fns"

interface AddHourlyIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDay: string | null
  selectedHour: number | null
}

export function AddHourlyIssueDialog({ open, onOpenChange, selectedDay, selectedHour }: AddHourlyIssueDialogProps) {
  const dispatch = useDispatch()
  const projects = useSelector((state: RootState) => state.projects.projects)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    day: "monday",
    hour: 9,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form when selectedDay or selectedHour changes
  useEffect(() => {
    if (selectedDay) {
      setFormData((prev) => ({ ...prev, day: selectedDay }))
    }

    if (selectedHour !== null) {
      setFormData((prev) => ({ ...prev, hour: selectedHour }))
    }
  }, [selectedDay, selectedHour])

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        description: "",
        projectId: "",
        day: selectedDay || "monday",
        hour: selectedHour !== null ? selectedHour : 9,
      })
      setErrors({})
    }
  }, [open, selectedDay, selectedHour])

  const handleChange = (field: string, value: string | number) => {
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

    if (!validateForm() || !currentUser) return

    const selectedProject = projects.find((p) => p.id === formData.projectId)

    dispatch(
      addHourlyIssue({
        title: formData.title,
        description: formData.description,
        projectId: formData.projectId,
        projectName: selectedProject?.name,
        day: formData.day as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
        hour: formData.hour,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        userInitials: currentUser.initials,
        completed: false,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Add a new task to your weekly schedule.</DialogDescription>
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
                placeholder="Enter task title"
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
                placeholder="Enter task description"
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
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
