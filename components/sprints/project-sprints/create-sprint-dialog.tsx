"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface CreateSprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
  projectList: Project[] | []
}

export function CreateSprintDialog({ projectList, open, onOpenChange, projectId }: CreateSprintDialogProps) {
  const dispatch = useDispatch()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 14)))
  const [completionStatus, setCompletionStatus] = useState<string>("")
  const [sprintType, setSprintType] = useState<"standard" | "project-team">("standard")
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [loading, setLoading] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<ProjectTaskStatus[] | []>([])

  const [openStartDatePopover, setOpenStartDatePopover] = useState(false)
  const [openEndDatePopover, setOpenEndDatePopover] = useState(false)

  const projectTeams = useMemo(() => teams.filter((team) => team.projectId === selectedProjectId), [selectedProjectId])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !selectedProjectId || !startDate || !endDate) {
      return
    }

    if (sprintType === "project-team" && !selectedTeamId) {
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
      completionStatus,
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
    setSelectedProjectId(projectId || "")
    setStartDate(new Date())
    setEndDate(new Date(new Date().setDate(new Date().getDate() + 14)))
    setCompletionStatus("done")
    setSprintType("standard")
    setSelectedTeamId("")
  }, [projectId])


  const saveSprint = async (newSprint: Sprint) => {
    setLoading(true)
    try {

      const response: Sprint = await BaseService.request(SPRINT_URL, {
        method: httpMethods.POST,
        body: { ...newSprint }
      })
      toast({
        title: `saved Sprint.`,
        description: `saved Sprint.`,
      })
      dispatch(addSprint(response))
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `saved Sprint failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('saved Sprint failed.', error)
        toast({
          title: `saved Sprint failed..`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }
  const getAllProjectTaskStatus = async (projectId: string) => {
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_TASK_STATUS_URL + "/project/" + projectId, {
        method: httpMethods.GET
      })
      toast({
        title: `Project Task Status get All.`,
        description: `Project Task Status get All `,
      })
      setTaskStatuses(response as ProjectTaskStatus[])
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Projects Task Status  failed:', error)
        toast({
          title: `Projects Task Status  find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }
  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value)
    setTaskStatuses([])
    setCompletionStatus("")
    if (!!value && value !== "all") {
      getAllProjectTaskStatus(value)
    }
  }
  const openStartPopover = (value: boolean) => {
    console.log(value)
    setOpenStartDatePopover(true)
  }
  const openEndPopover = (value: boolean) => {
    console.log(value)
    setOpenEndDatePopover(value)
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
                      <Select value={selectedProjectId} onValueChange={handleProjectChange} disabled={!!projectId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>

                          {!!projectList && projectList.map((project: Project) => (
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
                        onValueChange={setCompletionStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status for tasks" />
                        </SelectTrigger>
                        <SelectContent>
                          {!!taskStatuses && taskStatuses.map((status: ProjectTaskStatus) => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                            className={`w-full justify-start text-left font-normal ${startDate ? "border-red-500" : ""}`}
                          >
                            <Calendar className="mr-2 h-4 w-12" /> {openStartDatePopover + " "}
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>pickDate</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              // Set the selected date without showing today's date
                              if (date) {
                                setStartDate(date);
                                setOpenStartDatePopover(false); // Close popover after selecting a date
                              }
                            }}
                            initialFocus
                            disabled={(date) => date > new Date()} // Disable future dates
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
                      <Popover open={openEndDatePopover}
                        onOpenChange={(open) => {
                          console.log("end popover changed: ", open)
                          setOpenEndDatePopover(open)
                        }} >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${endDate ? "border-red-500" : ""}`}
                          >
                            <Calendar className="mr-2 h-4 w-12" /> {openEndDatePopover + " "}
                            {endDate ? (
                              format(endDate, "PPP")
                            ) : (
                              <span>pick Date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              // Set the selected date without showing today's date
                              if (date) {
                                setEndDate(date);
                                setOpenEndDatePopover(false); // Close popover after selecting a date
                              }
                            }}
                            initialFocus
                            disabled={(date) => date > new Date()} // Disable future dates
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
