"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addProject } from "@/lib/redux/features/projects-slice"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    team: [] as string[],
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

  const handleTeamChange = (userId: string) => {
    setFormData((prev) => {
      const newTeam = prev.team.includes(userId) ? prev.team.filter((id) => id !== userId) : [...prev.team, userId]
      return { ...prev, team: newTeam }
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required"
    }

    if (formData.team.length === 0) {
      newErrors.team = "At least one team member is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

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
      addProject({
        id: `project-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        progress: 0, // New projects start at 0% progress
        issueCount: 0, // New projects start with 0 issues
        team: teamMembers,
      }),
    )

    onOpenChange(false)
    setFormData({
      name: "",
      description: "",
      status: "Planning",
      team: [],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new project to your workspace. Fill out the details below.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={errors.name ? "text-[var(--fixed-danger)]" : ""}>
                Project Name
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
                Description
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

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status" className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className={errors.team ? "text-[var(--fixed-danger)]" : ""}>Team Members</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between border-[var(--fixed-card-border)]",
                      errors.team ? "border-[var(--fixed-danger)]" : "",
                    )}
                  >
                    {formData.team.length > 0 ? `${formData.team.length} members selected` : "Select team members"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search team members..." />
                    <CommandList>
                      <CommandEmpty>No team members found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem key={user.id} value={user.id} onSelect={() => handleTeamChange(user.id)}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.team.includes(user.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex items-center">
                              <span>{user.name}</span>
                              <Badge className="ml-2 text-xs">{user.role}</Badge>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {formData.team.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.team.map((userId) => {
                    const user = users.find((u) => u.id === userId)
                    return (
                      <Badge
                        key={userId}
                        variant="secondary"
                        className="flex items-center gap-1 bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                      >
                        {user?.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
                          onClick={() => handleTeamChange(userId)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    )
                  })}
                </div>
              )}

              {errors.team && <p className="text-xs text-[var(--fixed-danger)]">{errors.team}</p>}
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
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
