"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateProject } from "@/lib/redux/features/projects-slice"
import type { RootState } from "@/lib/redux/store"
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
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/types/project"
import Select from 'react-select'; // Import react-select
import { useLanguage } from "@/lib/i18n/context"

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)

  // Update the formData state to include the new fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    team: [] as string[],
    tags: [] as string[],
    startDate: "",
    endDate: "",
    repository: "",
  })
  const statusOptions = [
    { value: "Planning", label: "Planning" },
    { value: "In Progress", label: "In Progress" },
    { value: "On Hold", label: "On Hold" },
    { value: "Completed", label: "Completed" },
  ];

  // Add a new state for the tag input
  const [tagInput, setTagInput] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with project data
  useEffect(() => {
    if (project) {
      // Find user IDs based on team member names
      const teamIds = (project.team) && project.team
        .map((member) => {
          const user = users.find((u) => u.name === member.name)
          return user?.id || ""
        })
        .filter((id) => id !== "")

      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        team: teamIds || [],
        tags: project.tags || [],
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        repository: project.repository || "",
      })
    }
  }, [project, users])

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

  const handleTeamChange = (userId: string) => {
    setFormData((prev) => {
      const newTeam = prev.team.includes(userId) ? prev.team.filter((id) => id !== userId) : [...prev.team, userId]
      return { ...prev, team: newTeam }
    })
  }

  // Add a function to handle adding tags
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
      }
      setTagInput("")
    }
  }

  // Add a function to remove tags
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  // Update the validateForm function to include validation for new fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required"
    }

    // if (formData.team.length === 0) {
    //   newErrors.team = "At least one team member is required"
    // }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (start > end) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleSubmit function to include the new fields
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !project) return

    // Transform team members to the required format
    const teamMembers = formData.team.map((userId) => {
      const user = users.find((u) => u.id === userId)
      return {
        name: user?.name || "",
        avatar: user?.avatar || "",
        initials: user?.initials || "",
      }
    })

    dispatch(
      updateProject({
        id: project.id,
        changes: {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          team: teamMembers,
          tags: formData.tags,
          startDate: formData.startDate,
          endDate: formData.endDate,
          repository: formData.repository,
        },
      }),
    )

    onOpenChange(false)
    setErrors({})
  }
  // Dedicated handler for the status select component using react-select
  const handleStatusChange = (selectedOption: any) => {
    setFormData((prev) => ({ ...prev, status: selectedOption ? selectedOption.value : "" }));
  };


  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{translations.projects.editProject}</DialogTitle>
            <DialogDescription>{translations.projects.editProjectDescription}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={errors.name ? "text-[var(--fixed-danger)]" : ""}>
                {translations.projects.projectName}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.name && <p className="text-xs text-[var(--fixed-danger)]">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className={errors.description ? "text-[var(--fixed-danger)]" : ""}>
                {translations.projects.projectDescription}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={errors.description ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
                rows={3}
              />
              {errors.description && <p className="text-xs text-[var(--fixed-danger)]">{errors.description}</p>}
            </div>

            {/* Status Select with react-select */}
            <div className="grid gap-2">
              <Label htmlFor="status">{translations.projects.projectStatus}</Label>
              <Select
                id="status"
                options={statusOptions}
                value={statusOptions.find(option => option.value === formData.status)}
                onChange={handleStatusChange}
                classNamePrefix="react-select" // For custom styling if needed
              />
            </div>

            {/* Add the new form fields in the dialog content */}
            {/* Add this after the progress field in the form */}
            <div className="grid gap-2">
              <Label htmlFor="startDate">{translations.projects.projectStartDate}</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="border-[var(--fixed-card-border)]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate" className={errors.endDate ? "text-[var(--fixed-danger)]" : ""}>
                {translations.projects.projectEndDate}
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className={errors.endDate ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.endDate && <p className="text-xs text-[var(--fixed-danger)]">{errors.endDate}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repository">{translations.projects.projectRepositoryUrl}</Label>
              <Input
                id="repository"
                value={formData.repository}
                onChange={(e) => handleChange("repository", e.target.value)}
                placeholder="https://github.com/your-org/repository"
                className="border-[var(--fixed-card-border)]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">{translations.projects.projectTags}</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{translations.projects.remove}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
                className="border-[var(--fixed-card-border)]"
              />
              <p className="text-xs text-[var(--fixed-sidebar-muted)]">Press Enter to add a tag</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            >
              {translations.projects.cancel}
            </Button>
            <Button type="submit" className="bg-[var(--fixed-primary)] text-white">
              {translations.projects.updateProject}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
