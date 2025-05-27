"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addSprint } from "@/lib/redux/features/sprints-slice"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface CreateSprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSprintDialog({ open, onOpenChange }: CreateSprintDialogProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)

  const today = new Date()
  const twoWeeksLater = new Date(today)
  twoWeeksLater.setDate(today.getDate() + 14)

  const [formData, setFormData] = useState({
    name: "",
    startDate: today,
    endDate: twoWeeksLater,
    status: "planned",
    team: [] as string[],
    completionTaskStatus: "done",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: any) => {
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
      newErrors.name = "Sprint name is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date"
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
      addSprint({
        id: `sprint-${Date.now()}`,
        name: formData.name,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        status: formData.status as "planned" | "active" | "completed",
        totalIssues: 0,
        completedIssues: 0,
        team: teamMembers,
        completionTaskStatus: formData.completionTaskStatus,
      }),
    )

    onOpenChange(false)

    // Reset form
    setFormData({
      name: "",
      startDate: today,
      endDate: twoWeeksLater,
      status: "planned",
      team: [],
      completionTaskStatus: "done",
    })
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
            <DialogDescription>Plan your next development cycle.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={errors.name ? "text-[var(--fixed-danger)]" : ""}>
                Sprint Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Sprint 24"
                className={errors.name ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.name && <p className="text-xs text-[var(--fixed-danger)]">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate" className={errors.startDate ? "text-[var(--fixed-danger)]" : ""}>
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-[var(--fixed-card-border)]",
                        errors.startDate ? "border-[var(--fixed-danger)]" : "",
                        !formData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleChange("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && <p className="text-xs text-[var(--fixed-danger)]">{errors.startDate}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate" className={errors.endDate ? "text-[var(--fixed-danger)]" : ""}>
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-[var(--fixed-card-border)]",
                        errors.endDate ? "border-[var(--fixed-danger)]" : "",
                        !formData.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && <p className="text-xs text-[var(--fixed-danger)]">{errors.endDate}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status" className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
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

            <div className="grid gap-2">
              <Label htmlFor="completionTaskStatus">Task Status on Sprint Completion</Label>
              <Select
                value={formData.completionTaskStatus}
                onValueChange={(value) => handleChange("completionTaskStatus", value)}
              >
                <SelectTrigger id="completionTaskStatus" className="border-[var(--fixed-card-border)]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="backlog">Move to Backlog</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Default status for tasks when sprint is completed</p>
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
              Create Sprint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
