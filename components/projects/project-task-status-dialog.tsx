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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectTaskStatus } from "@/types/project"
import { Loader2 } from "lucide-react"


interface ProjectTaskStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  status: ProjectTaskStatus | null
  onSave: (status: ProjectTaskStatus) => void
  loading: boolean
}

interface ValidationErrors {
  id?: string | undefined | null
  name?: string
  label?: string
  color?: string
  order?: string
  turkish?: string
  english?: string
}

export function ProjectTaskStatusDialog({ open, onOpenChange, status, onSave, loading }: ProjectTaskStatusDialogProps) {
  const [formData, setFormData] = useState<ProjectTaskStatus>({
    id: undefined,
    projectId: status?.projectId ? status?.projectId : null,
    name: "",
    label: "",
    color: "#E2E8F0",
    order: 1,
    turkish: "",
    english: "",
  })

  const [activeTab, setActiveTab] = useState("general")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(loading || false)

  useEffect(() => {
    if (status) {
      setFormData(status)
    } else {
      setFormData({
        id: undefined,
        projectId: status?.projectId ? status?.projectId : null,
        name: "",
        label: "",
        color: "#E2E8F0",
        order: 1,
        turkish: "",
        english: "",
      })
    }
    setActiveTab("general")
    setErrors({})
    setIsSubmitting(false)
  }, [status, open])

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Status name is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = "Status name must be in kebab-case format (lowercase letters, numbers, and hyphens only)"
    } else if (formData.name.length < 2) {
      newErrors.name = "Status name must be at least 2 characters long"
    } else if (formData.name.length > 50) {
      newErrors.name = "Status name must be less than 50 characters"
    }

    // Validate label
    if (!formData.label.trim()) {
      newErrors.label = "Status label is required"
    } else if (formData.label.length < 2) {
      newErrors.label = "Status label must be at least 2 characters long"
    } else if (formData.label.length > 100) {
      newErrors.label = "Status label must be less than 100 characters"
    }

    // Validate color
    if (!formData.color) {
      newErrors.color = "Color is required"
    } else if (!/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
      newErrors.color = "Color must be a valid hex color (e.g., #FF0000)"
    }

    // Validate order
    if (!formData.order || formData.order < 1) {
      newErrors.order = "Order must be a positive number"
    } else if (formData.order > 999) {
      newErrors.order = "Order must be less than 1000"
    } else if (!Number.isInteger(formData.order)) {
      newErrors.order = "Order must be a whole number"
    }

    // Validate turkish
    if (!formData.turkish.trim()) {
      newErrors.turkish = "Turkish translation is required"
    } else if (formData.turkish.length < 2) {
      newErrors.turkish = "Turkish translation must be at least 2 characters long"
    } else if (formData.turkish.length > 100) {
      newErrors.turkish = "Turkish translation must be less than 100 characters"
    }

    // Validate english
    if (!formData.english.trim()) {
      newErrors.english = "English translation is required"
    } else if (formData.english.length < 2) {
      newErrors.english = "English translation must be at least 2 characters long"
    } else if (formData.english.length > 100) {
      newErrors.english = "English translation must be less than 100 characters"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      // If there are errors on the translations tab, switch to it
      if (validationErrors.turkish || validationErrors.english) {
        setActiveTab("translations")
      }
      setIsSubmitting(false)
      return
    }

    try {
      await onSave(formData)
    } catch (error) {
      console.error("Error saving status:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ProjectTaskStatus, value: string | number) => {
    setFormData({ ...formData, [field]: value })
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  return (<>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{status ? "Edit Status" : "Create Status"}</DialogTitle>
            <DialogDescription>
              {status ? "Update the details for this status." : "Add a new status for issues in this project."}
            </DialogDescription>
          </DialogHeader>
          {
            loading ?
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              </div>
              :
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="translations" className={errors.turkish || errors.english ? "text-red-600" : ""}>
                      Translations
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="space-y-4 pt-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Status Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="e.g., in-progress"
                            className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                          />
                          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                          <p className="text-xs text-[var(--fixed-sidebar-muted)]">System identifier used in code</p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="label">Status Label</Label>
                          <Input
                            id="label"
                            value={formData.label}
                            onChange={(e) => handleInputChange("label", e.target.value)}
                            placeholder="e.g., In Progress"
                            className={errors.label ? "border-red-500 focus-visible:ring-red-500" : ""}
                          />
                          {errors.label && <p className="text-xs text-red-600 mt-1">{errors.label}</p>}
                          <p className="text-xs text-[var(--fixed-sidebar-muted)]">Display name shown to users</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="color">Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              id="color"
                              value={formData.color}
                              onChange={(e) => handleInputChange("color", e.target.value)}
                              className={`w-12 h-10 p-1 ${errors.color ? "border-red-500" : ""}`}
                            />
                            <Input
                              type="text"
                              value={formData.color}
                              onChange={(e) => handleInputChange("color", e.target.value)}
                              placeholder="#000000"
                              className={`flex-1 ${errors.color ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            />
                          </div>
                          {errors.color && <p className="text-xs text-red-600 mt-1">{errors.color}</p>}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="order">Order</Label>
                          <Input
                            type="number"
                            id="order"
                            value={formData.order}
                            onChange={(e) => handleInputChange("order", Number.parseInt(e.target.value) || 0)}
                            min="1"
                            max="999"
                            className={errors.order ? "border-red-500 focus-visible:ring-red-500" : ""}
                          />
                          {errors.order && <p className="text-xs text-red-600 mt-1">{errors.order}</p>}
                          <p className="text-xs text-[var(--fixed-sidebar-muted)]">Display order in workflow</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="translations" className="space-y-4 pt-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="turkish">Turkish Value</Label>
                        <Input
                          id="turkish"
                          value={formData.turkish}
                          onChange={(e) => handleInputChange("turkish", e.target.value)}
                          placeholder="e.g., Devam Ediyor"
                          className={errors.turkish ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.turkish && <p className="text-xs text-red-600 mt-1">{errors.turkish}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="english">English Value</Label>
                        <Input
                          id="english"
                          value={formData.english}
                          onChange={(e) => handleInputChange("english", e.target.value)}
                          placeholder="e.g., In Progress"
                          className={errors.english ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.english && <p className="text-xs text-red-600 mt-1">{errors.english}</p>}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : status ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </>
          }
        </form>
      </DialogContent>
    </Dialog>
  </>
  )
}
