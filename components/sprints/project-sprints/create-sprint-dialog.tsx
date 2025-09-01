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
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Label } from "@/components/ui/label"
import { getAllProjectTaskStatusHelper, saveSprintHelper } from "@/lib/service/api-helpers"
import { useLanguage } from "@/lib/i18n/context"

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
  const { translations } = useLanguage()
  const t = translations.sprint.form

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectId || null)
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() + 14)))
  const [projectTaskStatusId, setProjectTaskStatusId] = useState<string | null>(null)
  const [sprintType, setSprintType] = useState<string>(SprintType.PROJECT)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<ProjectTaskStatus[] | []>([])
  const [loadingTaskStatuses, setLoadingTaskStatuses] = useState(false);

  const projectTeams = useMemo(() => teams.filter((team) => team.projectId === selectedProjectId), [selectedProjectId])
  const projectOptions = useMemo(() => projectList.map(project => ({ value: project.id, label: project.name })), [projectList])
  const teamOptions = useMemo(() => projectTeams.map(team => ({ value: team.id, label: team.name })), [projectTeams])
  const taskStatusOptions = useMemo(() => taskStatuses.map(status => ({ value: status.id, label: status.name })), [taskStatuses])

  useEffect(() => {
    if (projectId) setSelectedProjectId(projectId)
  }, [projectId])

  const fetchProjectTaskStatuses = useCallback(async (currentProjectId: string) => {
    setTaskStatuses([])
    const statusesData = await getAllProjectTaskStatusHelper(currentProjectId, { setLoading: setLoadingTaskStatuses })
    if (statusesData) {
      setTaskStatuses(statusesData)
      if (statusesData.length > 0 && !projectTaskStatusId) setProjectTaskStatusId(statusesData[0].id)
    } else setProjectTaskStatusId(null)
  }, [projectTaskStatusId])

  useEffect(() => {
    if (selectedProjectId && selectedProjectId !== "all") fetchProjectTaskStatuses(selectedProjectId)
    else {
      setTaskStatuses([])
      setProjectTaskStatusId(null)
    }
  }, [selectedProjectId, fetchProjectTaskStatuses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !selectedProjectId || !startDate || !endDate) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    if (sprintType === SprintType.TEAM && !selectedTeamId) {
      toast({ title: "Missing Team", description: "Please select a project team for 'Project Team Sprint' type.", variant: "destructive" })
      return
    }

    const newSprint: Sprint = {
      id: null,
      name,
      description,
      projectId: selectedProjectId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      projectTaskStatusId,
      sprintType,
      projectTeamId: sprintType === SprintType.TEAM ? selectedTeamId : undefined,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const response = await saveSprintHelper(newSprint, { setLoading })
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t.create}</DialogTitle>
            <DialogDescription>{t.sprintDescription}</DialogDescription>
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
                    <Label className="text-right">{t.sprintName}</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t.sprintDescription}</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t.project}</Label>
                    <div className="col-span-3">
                      <Select
                        options={projectOptions}
                        value={projectOptions.find(option => option.value === selectedProjectId)}
                        onChange={(option) => { setSelectedProjectId(option ? option.value : null); setProjectTaskStatusId(null); setTaskStatuses([]) }}
                        placeholder={t.selectProjectPlaceholder}
                        isDisabled={!!projectId}
                        isClearable
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t.sprintType}</Label>
                    <div className="col-span-3">
                      <Select
                        value={sprintTypeOptions.find(option => option.value === sprintType)}
                        onChange={(option) => setSprintType(option?.value || SprintType.PROJECT)}
                        options={sprintTypeOptions}
                        placeholder={t.selectSprintTypePlaceholder}
                      />
                    </div>
                  </div>

                  {sprintType === SprintType.TEAM && selectedProjectId && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t.projectTeam}</Label>
                      <div className="col-span-3">
                        <Select
                          options={teamOptions}
                          value={teamOptions.find(option => option.value === selectedTeamId)}
                          onChange={(option) => setSelectedTeamId(option ? option.value : null)}
                          placeholder={t.selectTeamPlaceholder}
                          isClearable
                          noOptionsMessage={() => t.noTeamsAvailable}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t.taskStatusCompletion}</Label>
                    <div className="col-span-3">
                      {
                        loadingTaskStatuses ?
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                          </div>
                          :
                          <Select
                            options={taskStatusOptions}
                            value={taskStatusOptions.find(option => option.value === projectTaskStatusId)}
                            onChange={(option) => setProjectTaskStatusId(option ? option.value : null)}
                            placeholder={t.selectTaskStatusPlaceholder}
                            isClearable
                            isDisabled={!selectedProjectId || taskStatuses.length === 0}
                            noOptionsMessage={() => t.noTaskStatusesAvailable}
                          />
                      }
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t.startDate}</Label>
                    <div className="col-span-3 relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="PPP"
                        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                        placeholderText={t.startDate}
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t.endDate}</Label>
                    <div className="col-span-3 relative">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="PPP"
                        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                        placeholderText={t.endDate}
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
                  <Button type="submit" disabled={sprintType === SprintType.TEAM && !selectedTeamId}>{t.create}</Button>
                </DialogFooter>
              </>
          }
        </form>
      </DialogContent>
    </Dialog>
  )
}
