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
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// Removed Radix Select imports
import { Calendar, CalendarIcon, Loader2 } from "lucide-react"
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

interface CreateSprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
  projectList: Project[] | []
}

// Define types for react-select options
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
  const [description, setDescription]
    = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectId || null)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 14)))
  const [completionStatus, setCompletionStatus] = useState<string | null>(null)
  const [sprintType, setSprintType] = useState<string>("standard") // Default to 'standard'
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [loadingTaskStatus, setLoadingTaskStatus] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<ProjectTaskStatus[] | []>([])

  const [openStartDatePopover, setOpenStartDatePopover] = useState(false)
  const [openEndDatePopover, setOpenEndDatePopover] = useState(false)

  const projectTeams = useMemo(() => teams.filter((team) => team.projectId === selectedProjectId), [selectedProjectId])

  // Options for react-select components
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
      completionStatus: completionStatus || "done", // Default to 'done' if not selected
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
    setCompletionStatus(null) // Reset to null for react-select
    setSprintType("standard")
    setSelectedTeamId(null) // Reset to null for react-select
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
    setLoadingTaskStatus(true)
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
    setLoadingTaskStatus(false)
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
                    <Input
                      placeholder="Write Name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="Write Description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      placeholder="Description"
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
                          setCompletionStatus(null); // Reset completion status when project changes
                          setTaskStatuses([]); // Clear task statuses
                        }}
                        placeholder="Select a project"
                        isDisabled={!!projectId}
                        isClearable
                      />
                    </div>
                  </div>
                  {/* 
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
                  </div> */}

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
                    {
                      loadingTaskStatus ?
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                          </div>
                        </div>
                        :
                        <>
                          <div className="col-span-3">
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
                          </div>
                        </>
                    }
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <div className="col-span-3">
                      <Popover open={openStartDatePopover} onOpenChange={setOpenStartDatePopover}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${startDate ? "" : "text-muted-foreground"}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              setOpenStartDatePopover(false);
                            }}
                            initialFocus
                            // You might want to adjust this disabled logic. Currently, it disables future dates.
                            // If sprints can start in the future, remove this.
                            disabled={(date) => date < new Date("1900-01-01")} // Example: allow all dates after a very early date
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <div className="col-span-3">
                      <Popover open={openEndDatePopover} onOpenChange={setOpenEndDatePopover}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${endDate ? "" : "text-muted-foreground"}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? (
                              format(endDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date);
                              setOpenEndDatePopover(false);
                            }}
                            initialFocus
                            // You might want to adjust this disabled logic as well.
                            disabled={(date) => date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
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