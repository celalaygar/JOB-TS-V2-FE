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
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { GET_PROJECT_USERS, PROJECT_URL } from "@/lib/service/BasePath"
import { Project, ProjectUser } from "@/types/project"
import BaseService from "@/lib/service/BaseService"
import { httpMethods } from "@/lib/service/HttpService"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    team: [] as string[],
    tags: [] as string[],
    startDate: "",
    endDate: "",
    repository: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Add a new state for the tag input
  const [tagInput, setTagInput] = useState("")

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    let responseProject: Project = await saveProject();
    if (!responseProject) {
      return;
    }
    dispatch(
      addProject({
        id: responseProject.id,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        progress: 0, // New projects start at 0% progress
        issueCount: 0, // New projects start with 0 issues
        //team: teamMembers,
        tags: formData.tags,
        startDate: formData.startDate,
        endDate: formData.endDate,
        repository: formData.repository,
      }),
    )

    setFormData({
      name: "",
      description: "",
      status: "Planning",
      team: [],
      tags: [],
      startDate: "",
      endDate: "",
      repository: "",
    })
    onOpenChange(false)
  }

  const saveProject = async () => {
    let project = null;
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_URL, {
        method: httpMethods.POST,
        body: formData
      })
      project = response;
      console.log("Project saved")
      console.log(response)
      toast({
        title: `Project saved.`,
        description: `Project saved.`,
      })
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Project failed:', error)
        toast({
          title: `Project find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
    return project;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your workspace. Fill out the details below.</DialogDescription>
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

                    {/* <div className="grid gap-2">
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
              </div> */}

                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
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
                        End Date
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
                      <Label htmlFor="repository">Repository URL</Label>
                      <Input
                        id="repository"
                        value={formData.repository}
                        onChange={(e) => handleChange("repository", e.target.value)}
                        placeholder="https://github.com/your-org/repository"
                        className="border-[var(--fixed-card-border)]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags</Label>
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
                              <span className="sr-only">Remove</span>
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
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[var(--fixed-primary)] text-white">
                      Create Project
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
