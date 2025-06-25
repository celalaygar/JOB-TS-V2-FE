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

import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { updateSprint } from "@/lib/redux/features/sprints-slice"
import type { RootState } from "@/lib/redux/store"
import { teams } from "@/data/teams"
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { Project, ProjectTaskStatus } from "@/types/project"
import { SPRINT_URL, PROJECT_TASK_STATUS_URL } from "@/lib/service/BasePath"
import BaseService from "@/lib/service/BaseService"
import { httpMethods } from "@/lib/service/HttpService"
import { toast } from "@/hooks/use-toast"


interface EditSprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sprintId: string
  projectList: Project[] | [] // projectList prop'u burada kullanılacak
}

interface SelectOption {
  value: string;
  label: string;
}

export function EditSprintDialog({ open, onOpenChange, sprintId, projectList }: EditSprintDialogProps) {
  const dispatch = useDispatch()
  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))
  // const projects = useSelector((state: RootState) => state.projects.projects) // Bu satır artık kullanılmıyor

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [status, setStatus] = useState<string>("planning")
  const [completionStatus, setCompletionStatus] = useState<string | null>(null)
  const [sprintType, setSprintType] = useState<string>("standard")
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [taskStatuses, setTaskStatuses] = useState<ProjectTaskStatus[] | []>([])
  const [loading, setLoading] = useState(false);
  const [loadingTaskStatuses, setLoadingTaskStatuses] = useState(false);

  // Memoized options for react-select, şimdi projectList prop'undan geliyor
  const projectOptions = useMemo(() => projectList.map(p => ({ value: p.id, label: p.name })), [projectList]);
  const sprintTypeOptions: SelectOption[] = useMemo(() => [
    { value: "standard", label: "Standard Sprint" },
    { value: "project-team", label: "Project Team Sprint" }
  ], []);
  const projectTeams = useMemo(() => teams.filter((team) => team.projectId === selectedProjectId), [selectedProjectId]);
  const teamOptions = useMemo(() => projectTeams.map(team => ({ value: team.id, label: team.name })), [projectTeams]);

  const sprintStatusOptions: SelectOption[] = useMemo(() => [
    { value: "planning", label: "Planning" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ], []);

  const completionStatusOptions = useMemo(() => taskStatuses.map(statusItem => ({ value: statusItem.id, label: statusItem.name })), [taskStatuses]);


  useEffect(() => {
    if (sprint) {
      setName(sprint.name)
      setDescription(sprint.description || "")
      setSelectedProjectId(sprint.projectId)
      setStartDate(sprint.startDate ? new Date(sprint.startDate) : null)
      setEndDate(sprint.endDate ? new Date(sprint.endDate) : null)
      setStatus(sprint.status)
      setCompletionStatus(sprint.completionStatus || null)
      setSprintType(sprint.sprintType || "standard")
      setSelectedTeamId(sprint.teamId || null)
    }
  }, [sprint])

  useEffect(() => {
    if (selectedProjectId) {
      getAllProjectTaskStatus(selectedProjectId);
    } else {
      setTaskStatuses([]);
      setCompletionStatus(null);
    }
  }, [selectedProjectId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sprint || !name || !selectedProjectId || !startDate || !endDate) {
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

    const updatedSprint = {
      ...sprint,
      name,
      description,
      projectId: selectedProjectId,
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
      status: status as "planning" | "active" | "completed" | "cancelled",
      completionStatus: completionStatus || "done",
      sprintType: sprintType as "standard" | "project-team",
      teamId: sprintType === "project-team" ? selectedTeamId : undefined,
      updatedAt: new Date().toISOString(),
    }
    await updateExistingSprint(updatedSprint);
    onOpenChange(false)
  }

  const updateExistingSprint = async (updatedSprint: any) => {
    setLoading(true);
    try {
      const response = await BaseService.request(`${SPRINT_URL}/${updatedSprint.id}`, {
        method: httpMethods.PUT,
        body: updatedSprint
      });
      toast({
        title: "Sprint Updated",
        description: `Sprint "${response.name}" has been successfully updated.`,
      });
      dispatch(updateSprint(response));
    } catch (error: any) {
      console.error("Failed to update sprint:", error);
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating the sprint.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAllProjectTaskStatus = async (projectId: string) => {
    setLoadingTaskStatuses(true);
    try {
      const response = await BaseService.request(`${PROJECT_TASK_STATUS_URL}/project/${projectId}`, {
        method: httpMethods.GET
      });
      setTaskStatuses(response as ProjectTaskStatus[]);
      if (completionStatus && !(response as ProjectTaskStatus[]).some(s => s.id === completionStatus)) {
        setCompletionStatus(null);
      }
    } catch (error: any) {
      console.error('Failed to fetch project task statuses:', error)
      toast({
        title: `Failed to load Project Task Statuses.`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoadingTaskStatuses(false);
    }
  };

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
          {loading ? (
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </div>
          ) : (
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
                      setSelectedTeamId(null);
                    }}
                    placeholder="Select a project"
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
                    options={sprintTypeOptions}
                    value={sprintTypeOptions.find(option => option.value === sprintType)}
                    onChange={(option) => {
                      setSprintType(option ? option.value : "standard");
                      if (option?.value === "standard") {
                        setSelectedTeamId(null);
                      }
                    }}
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
                          options={completionStatusOptions}
                          value={completionStatusOptions.find(option => option.value === completionStatus)}
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
                      dateFormat="PPP"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      wrapperClassName="w-full"
                      placeholderText="Pick a date"
                      showPopperArrow={false}
                      popperPlacement="bottom-start"
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
                      minDate={startDate || undefined}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <Select
                    id="status"
                    options={sprintStatusOptions}
                    value={sprintStatusOptions.find(option => option.value === status)}
                    onChange={(option) => setStatus(option ? option.value : "planning")}
                    placeholder="Select status"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (sprintType === "project-team" && !selectedTeamId)}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}