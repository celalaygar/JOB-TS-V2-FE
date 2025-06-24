"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { updateSprint } from "@/lib/redux/features/sprints-slice"
import type { RootState } from "@/lib/redux/store"
import { teams } from "@/data/teams"

interface EditSprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sprintId: string
}

export function EditSprintDialog({ open, onOpenChange, sprintId }: EditSprintDialogProps) {
  const dispatch = useDispatch()
  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))
  const projects = useSelector((state: RootState) => state.projects.projects)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [status, setStatus] = useState<"planning" | "active" | "completed" | "cancelled">("planning")
  const [completionStatus, setCompletionStatus] = useState<"done" | "review" | "in-progress" | "backlog">("done")
  const [sprintType, setSprintType] = useState<"standard" | "project-team">("standard")
  const [selectedTeamId, setSelectedTeamId] = useState("")

  const projectTeams = useMemo(() => teams.filter((team) => team.projectId === selectedProjectId), [selectedProjectId])

  useEffect(() => {
    if (sprint) {
      setName(sprint.name)
      setDescription(sprint.description || "")
      setSelectedProjectId(sprint.projectId)
      setStartDate(sprint.startDate ? new Date(sprint.startDate) : undefined)
      setEndDate(sprint.endDate ? new Date(sprint.endDate) : undefined)
      setStatus(sprint.status as "planning" | "active" | "completed" | "cancelled")
      setCompletionStatus((sprint.completionStatus as "done" | "review" | "in-progress" | "backlog") || "done")
      setSprintType((sprint.sprintType as "standard" | "project-team") || "standard")
      setSelectedTeamId(sprint.teamId || "")
    }
  }, [sprint])

  useEffect(() => {
    if (sprint && selectedProjectId !== sprint.projectId) {
      setSelectedTeamId("")
    }
  }, [selectedProjectId, sprint])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sprint || !name || !selectedProjectId || !startDate || !endDate) {
      return
    }
    if (sprintType === "project-team" && !selectedTeamId) {
      return
    }
    const updatedSprint = {
      ...sprint,
      name,
      description,
      projectId: selectedProjectId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status,
      completionStatus,
      sprintType,
      teamId: sprintType === "project-team" ? selectedTeamId : undefined,
      updatedAt: new Date().toISOString(),
    }
    dispatch(updateSprint(updatedSprint))
    onOpenChange(false)
  }

  if (!sprint) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Sprint</DialogTitle>
            <DialogDescription>Update the sprint details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Project
              </Label>
              <div className="col-span-3">
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sprintType" className="text-right">
                Sprint Type
              </Label>
              <div className="col-span-3">
                <Select value={sprintType} onValueChange={(value: "standard" | "project-team") => setSprintType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sprint Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Sprint</SelectItem>
                    <SelectItem value="project-team">Project Team Sprint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {sprintType === "project-team" && selectedProjectId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team" className="text-right">
                  Project Team
                </Label>
                <div className="col-span-3">
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTeams.length > 0 ? (
                        projectTeams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-teams" disabled>
                          No teams available for this project
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="completionStatus" className="text-right">
                Task Status on Completion
              </Label>
              <div className="col-span-3">
                <Select
                  value={completionStatus}
                  onValueChange={(value: "done" | "review" | "in-progress" | "backlog") => setCompletionStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status for tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="backlog">Move to Backlog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={status}
                  onValueChange={(value: "planning" | "active" | "completed" | "cancelled") => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={sprintType === "project-team" && !selectedTeamId}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
