"use client"

import type React from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
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
// Removed Calendar component imports from shadcn/ui
// import { Calendar as CalendarComponent } from "@/components/ui/calendar"
// Removed Popover component imports from shadcn/ui
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react" // Still need CalendarIcon
import { format } from "date-fns"
import { addSprint } from "@/lib/redux/features/sprints-slice"
import { teams } from "@/data/teams"
import { Project, ProjectTaskStatus } from "@/types/project"
import { toast } from "@/hooks/use-toast"
import { PROJECT_TASK_STATUS_URL, SPRINT_URL } from "@/lib/service/BasePath"
import BaseService from "@/lib/service/BaseService"
import { httpMethods } from "@/lib/service/HttpService"
import { Sprint } from "@/types/sprint"
import Select from "react-select"

// react-datepicker imports
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css" // Don't forget to import the CSS!


interface CreateSprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
  projectList: Project[] | []
}

interface SelectOption {
  value: string
  label: string
}

const sprintTypeOptions: SelectOption[] = [
  { value: "standard", label: "Standard Sprint" },
  { value: "project-team", label: "Project Team Sprint" }
]

export function CreateSprintDialog({ projectList, open, onOpenChange, projectId }: CreateSprintDialogProps) {
  const dispatch = useDispatch()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectId || null)
  const [startDate, setStartDate] = useState<Date | null>(new Date()) // Change to Date | null
  const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() + 14))) // Change to Date | null
  const [completionStatus, setCompletionStatus] = useState<string | null>(null)
  const [sprintType, setSprintType] = useState<string>("standard")
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<ProjectTaskStatus[] | []>([])
  const [loadingTaskStatuses, setLoadingTaskStatuses] = useState(false);

  // No longer need separate state for popover open/close with react-datepicker

  const projectTeams = useMemo(() => teams.filter((team) => team.projectId === selectedProjectId), [selectedProjectId])

  const projectOptions = useMemo(() => projectList.map(project => ({ value: project.id, label: project.name })), [projectList]);
  const teamOptions = useMemo(() => projectTeams.map(team => ({ value: team.id, label: team.name })), [projectTeams]);
  const taskStatusOptions = useMemo(() => taskStatuses.map(status => ({ value: status.id, label: status.name })), [taskStatuses]);

  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedProjectId && selectedProjectId !== "all") {
      getAllProjectTaskStatus(selectedProjectId);
    } else {
      setTaskStatuses([]);
      setCompletionStatus(null);
    }
  }, [selectedProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !selectedProjectId || !startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return
    }

    if (sprintType === "project-team" && !selectedTeamId) {
      toast({
        title: "Missing Team",
        description: "Please select a project team for 'Project Team Sprint' type.",
        variant: "destructive",
      });
      return
    }

    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      name,
      description,
      projectId: selectedProjectId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: "planning",
      completionStatus: completionStatus || "done",
      sprintType,
      teamId: sprintType === "project-team" ? selectedTeamId : undefined,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await saveSprint(newSprint)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = useCallback(() => {
    setName("")
    setDescription("")
    setSelectedProjectId(projectId || null)
    setStartDate(new Date())
    setEndDate(new Date(new Date().setDate(new Date().getDate() + 14)))
    setCompletionStatus(null)
    setSprintType("standard")
    setSelectedTeamId(null)
  }, [projectId])

  const saveSprint = async (newSprint: Sprint) => {
    setLoading(true)
    try {
      const response: Sprint = await BaseService.request(SPRINT_URL, {
        method: httpMethods.POST,
        body: { ...newSprint }
      })
      toast({
        title: `Sprint saved.`,
        description: `Sprint "${response.name}" has been successfully saved.`,
      })
      dispatch(addSprint(response))
    } catch (error: any) {
      console.error('Failed to save sprint:', error);
      toast({
        title: `Failed to save Sprint.`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const getAllProjectTaskStatus = async (projectId: string) => {
    setLoadingTaskStatuses(true)
    try {
      const response = await BaseService.request(PROJECT_TASK_STATUS_URL + "/project/" + projectId, {
        method: httpMethods.GET
      })
      toast({
        title: `Project Task Statuses loaded.`,
        description: `Task statuses for project ${projectId} have been retrieved.`,
      })
      setTaskStatuses(response as ProjectTaskStatus[])
    } catch (error: any) {
      console.error('Failed to fetch project task statuses:', error)
      toast({
        title: `Failed to load Project Task Statuses.`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    }
    setLoadingTaskStatuses(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
            <DialogDescription>Create a new sprint for your project.</DialogDescription>
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
                      <Select
                        id="project"
                        options={projectOptions}
                        value={projectOptions.find(option => option.value === selectedProjectId)}
                        onChange={(option) => {
                          setSelectedProjectId(option ? option.value : null);
                          setCompletionStatus(null);
                          setTaskStatuses([]);
                        }}
                        placeholder="Select a project"
                        isDisabled={!!projectId}
                        isClearable
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sprintType" className="text-right">
                      Sprint Type
                    </Label>
                    <div className="col-span-3">
                      <Select
                        id="sprintType"
                        value={sprintTypeOptions.find(option => option.value === sprintType)}
                        onChange={(option) => setSprintType(option?.value || "standard")}
                        options={sprintTypeOptions}
                        placeholder="Select Sprint Type"
                      />
                    </div>
                  </div>

                  {sprintType === "project-team" && selectedProjectId && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="team" className="text-right">
                        Project Team
                      </Label>
                      <div className="col-span-3">
                        <Select
                          id="team"
                          options={teamOptions}
                          value={teamOptions.find(option => option.value === selectedTeamId)}
                          onChange={(option) => setSelectedTeamId(option ? option.value : null)}
                          placeholder="Select a team"
                          isClearable
                          noOptionsMessage={() => "No teams available for this project"}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="completionStatus" className="text-right">
                      Task Status on Completion
                    </Label>
                    <div className="col-span-3">
                      {
                        loadingTaskStatuses ?
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            </div>
                          </div>
                          :
                          <>
                            <Select
                              id="completionStatus"
                              options={taskStatusOptions}
                              value={taskStatusOptions.find(option => option.value === completionStatus)}
                              onChange={(option) => setCompletionStatus(option ? option.value : null)}
                              placeholder="Select status for tasks"
                              isClearable
                              isDisabled={!selectedProjectId || taskStatuses.length === 0}
                              noOptionsMessage={() => "No task statuses available for this project. Please select a project first."}
                            />
                          </>
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <div className="col-span-3">
                      <div className="relative">
                        <DatePicker
                          selected={startDate}
                          onChange={(date: Date | null) => setStartDate(date)}
                          dateFormat="PPP" // Consistent with format(date, "PPP")
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          wrapperClassName="w-full"
                          placeholderText="Pick a date"
                          showPopperArrow={false} // Hides the arrow on the popover
                          popperPlacement="bottom-start" // Adjust placement if needed
                        // You can add minDate and maxDate props if you need date restrictions
                        // minDate={new Date()} // Example: disable past dates
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <div className="col-span-3">
                      <div className="relative">
                        <DatePicker
                          selected={endDate}
                          onChange={(date: Date | null) => setEndDate(date)}
                          dateFormat="PPP"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          wrapperClassName="w-full"
                          placeholderText="Pick a date"
                          showPopperArrow={false}
                          popperPlacement="bottom-start"
                        // minDate={startDate || new Date()} // Example: End date must be after start date
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={sprintType === "project-team" && !selectedTeamId}>
                    Create Sprint
                  </Button>
                </DialogFooter>
              </>
          }
        </form>
      </DialogContent>
    </Dialog >
  )
}