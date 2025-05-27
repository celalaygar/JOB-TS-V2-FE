"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import type { Task } from "@/app/weekly-board/page"

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function EditTaskModal({ isOpen, onClose, task, onUpdateTask, onDeleteTask }: EditTaskModalProps) {
  // Sample projects
  const projects = [
    { id: "project-1", name: "Website Redesign", color: "bg-blue-100 border-blue-300 text-blue-800" },
    { id: "project-2", name: "Mobile App", color: "bg-green-100 border-green-300 text-green-800" },
    { id: "project-3", name: "API Development", color: "bg-purple-100 border-purple-300 text-purple-800" },
  ]

  // Form state
  const [formData, setFormData] = useState<Task>(task)

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Update form when task changes
  useEffect(() => {
    setFormData(task)
  }, [task])

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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // If project is selected, update project name and color
      if (field === "projectId") {
        const selectedProject = projects.find((p) => p.id === value)
        if (selectedProject) {
          updated.projectName = selectedProject.name
          updated.color = selectedProject.color
        }
      }

      return updated
    })

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

    onUpdateTask(formData)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update your task details.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
                  Task Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter task title"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="project" className={errors.projectId ? "text-destructive" : ""}>
                  Project
                </Label>
                <Select value={formData.projectId} onValueChange={(value) => handleChange("projectId", value)}>
                  <SelectTrigger id="project" className={errors.projectId ? "border-destructive" : ""}>
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
                {errors.projectId && <p className="text-xs text-destructive">{errors.projectId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="day">Day</Label>
                  <Select value={formData.day} onValueChange={(value) => handleChange("day", value as Task["day"])}>
                    <SelectTrigger id="day">
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
                    <SelectTrigger id="hour">
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

              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="completed"
                  checked={formData.completed}
                  onChange={(e) => handleChange("completed", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="completed" className="text-sm font-normal">
                  Mark as completed
                </Label>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div>
                <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit">Update Task</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDeleteTask(task.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
