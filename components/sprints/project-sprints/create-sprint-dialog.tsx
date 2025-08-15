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
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Loader2 } from "lucide-react"
import { addSprint } from "@/lib/redux/features/sprints-slice"
import { teams } from "@/data/teams"
import { Project, ProjectTaskStatus } from "@/types/project"
import { toast } from "@/hooks/use-toast"
import { Sprint, SprintType } from "@/types/sprint"
import Select from "react-select"

// react-datepicker imports
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css" // Don't forget to import the CSS!
import { Label } from "@/components/ui/label"
import { getAllProjectTaskStatusHelper, saveSprintHelper } from "@/lib/service/api-helpers"


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
  { value: SprintType.PROJECT, label: "Standard Sprint" },
  { value: SprintType.TEAM, label: "Project Team Sprint" }
]

export function CreateSprintDialog({ projectList, open, onOpenChange, projectId }: CreateSprintDialogProps) {
  const dispatch = useDispatch()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectId || null)
  const [startDate, setStartDate] = useState<Date | null>(new Date()) // Change to Date | null
  const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() + 14))) // Change to Date | null
  const [projectTaskStatusId, setProjectTaskStatusId] = useState<string | null>(null)
  const [sprintType, setSprintType] = useState<string>(SprintType.PROJECT)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<ProjectTaskStatus[] | []>([])
  const [loadingTaskStatuses, setLoadingTaskStatuses] = useState(false);

  const projectTeams = useMemo(() => teams.filter((team) => team.projectId === selectedProjectId), [selectedProjectId])

  const projectOptions = useMemo(() => projectList.map(project => ({ value: project.id, label: project.name })), [projectList]);
  const teamOptions = useMemo(() => projectTeams.map(team => ({ value: team.id, label: team.name })), [projectTeams]);
  const taskStatusOptions = useMemo(() => taskStatuses.map(status => ({ value: status.id, label: status.name })), [taskStatuses]);

  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId]);

  const fetchProjectTaskStatuses = useCallback(async (currentProjectId: string) => {
    setTaskStatuses([]); // Clear existing statuses
    const statusesData = await getAllProjectTaskStatusHelper(currentProjectId, { setLoading: setLoadingTaskStatuses });
    if (statusesData) {
      setTaskStatuses(statusesData);
      // Automatically select the first status if available and none is selected
      if (statusesData.length > 0 && !projectTaskStatusId) {
        setProjectTaskStatusId(statusesData[0].id);
      }
    } else {
      setProjectTaskStatusId(null);
    }
  }, [projectTaskStatusId]);


  useEffect(() => {
    if (selectedProjectId && selectedProjectId !== "all") {
      fetchProjectTaskStatuses(selectedProjectId);
    } else {
      setTaskStatuses([]);
      setProjectTaskStatusId(null);
    }
  }, [selectedProjectId, fetchProjectTaskStatuses]);

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

    if (sprintType === SprintType.TEAM && !selectedTeamId) {
      toast({
        title: "Missing Team",
        description: "Please select a project team for 'Project Team Sprint' type.",
        variant: "destructive",
      });
      return
    }

    const newSprint: Sprint = {
      id: null,
      name,
      description,
      projectId: selectedProjectId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      //status: "planning",
      projectTaskStatusId: projectTaskStatusId,
      sprintType: SprintType.PROJECT,
      projectTeamId: sprintType === SprintType.TEAM ? selectedTeamId : undefined,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const response = await saveSprintHelper(newSprint, { setLoading });
    if (response) {
      dispatch(addSprint(response))
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = useCallback(() => {
    setName("")
    setDescription("")
    setSelectedProjectId(projectId || null)
    setStartDate(new Date())
    setEndDate(new Date(new Date().setDate(new Date().getDate() + 14)))
    setProjectTaskStatusId(null)
    setSprintType(SprintType.PROJECT)
    setSelectedTeamId(null)
  }, [projectId])


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
                    <Label className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
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
                    <Label className="text-right">
                      Project
                    </Label>
                    <div className="col-span-3">
                      <Select className="border-red-500"
                        id="project"
                        options={projectOptions}
                        value={projectOptions.find(option => option.value === selectedProjectId)}
                        onChange={(option) => {
                          setSelectedProjectId(option ? option.value : null);
                          setProjectTaskStatusId(null);
                          setTaskStatuses([]);
                        }}
                        placeholder="Select a project"
                        isDisabled={!!projectId}
                        isClearable
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Sprint Type
                    </Label>
                    <div className="col-span-3">
                      <Select
                        id="sprintType"
                        value={sprintTypeOptions.find(option => option.value === sprintType)}
                        onChange={(option) => setSprintType(option?.value || SprintType.PROJECT)}
                        options={sprintTypeOptions}
                        placeholder="Select Sprint Type"
                      />
                    </div>
                  </div>

                  {sprintType === SprintType.TEAM && selectedProjectId && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">
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
                    <Label className="text-right">
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
                              id="projectTaskStatusId"
                              options={taskStatusOptions}
                              value={taskStatusOptions.find(option => option.value === projectTaskStatusId)}
                              onChange={(option) => setProjectTaskStatusId(option ? option.value : null)}
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
                    <Label className="text-right">
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
                    <Label className="text-right">
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
                  <Button type="submit" disabled={sprintType === SprintType.TEAM && !selectedTeamId}>
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
