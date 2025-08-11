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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/data/projects"
import { RootState } from "@/lib/redux/store"
import { useSelector } from "react-redux"

interface CreateTeamDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
}

export function CreateTeamDialog({ isOpen, onOpenChange, projects }: CreateTeamDialogProps) {
  const { toast } = useToast()

  const allProjects = useSelector((state: RootState) => state.projects.projects)
  // Form state for creating a new team
  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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

    if (!formData.projectId) {
      newErrors.projectId = "Project is required"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Team description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Here you would typically save the new team to your data store
    toast({
      title: "Team created",
      description: `Team "${formData.name}" has been created successfully.`,
    })

    // Reset form and close dialog
    setFormData({
      projectId: "",
      name: "",
      description: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a new team for a project. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project" className={errors.projectId ? "text-destructive" : ""}>
                Project
              </Label>
              <Select value={formData.projectId} onValueChange={(value) => handleChange("projectId", value)}>
                <SelectTrigger id="project" className={errors.projectId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {!!allProjects && allProjects.map((project: Project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && <p className="text-xs text-destructive">{errors.projectId}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                Team Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter team name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter team description"
                className={errors.description ? "border-destructive" : ""}
                rows={3}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Team</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
