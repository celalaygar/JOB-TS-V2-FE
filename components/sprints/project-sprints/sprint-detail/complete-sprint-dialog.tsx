"use client"

import { useCallback, useEffect, useState } from "react"
import { updateSingleSprint } from "@/lib/redux/features/sprints-slice"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { CompletionResponseDto, Sprint, SprintStatus, UpdateSprintStatusRequest } from "@/types/sprint"
import { getNonCompletedSprintsHelper } from "@/lib/service/api-helpers"
import { useLanguage } from "@/lib/i18n/context"
import { ProjectTask } from "@/types/task"
import { completeSprintHelper } from "@/lib/service/helper/sprint-helper"

interface CompleteSprintDialogProps {
  sprint: Sprint
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: ProjectTask[]
  fetchData?: () => void
}

export function CompleteSprintDialog({ sprint, open, onOpenChange, tasks }: CompleteSprintDialogProps) {
  const dispatch = useDispatch()
  const { translations } = useLanguage()
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [destination, setDestination] = useState<"backlog" | "sprint">("backlog")
  const [targetSprintId, setTargetSprintId] = useState<string>("")
  const [completedTasks, setCompletedTasks] = useState(0)
  const [incompleteTasks, setIncompleteTasks] = useState(0)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const controlCompletion = useCallback(() => {
    const comp = tasks.filter(
      (task: ProjectTask) => task.projectTaskStatus.id === sprint.taskStatusOnCompletion.id,
    ).length
    setCompletedTasks(comp)
    const incomp = tasks.length - comp
    const compPercentage = tasks.length > 0 ? Math.round((comp / tasks.length) * 100) : 0
    setCompletionPercentage(compPercentage)
    setIncompleteTasks(incomp)
    setDestination(comp === tasks.length ? "sprint" : "backlog")
  }, [tasks, sprint.taskStatusOnCompletion.id])

  useEffect(() => {
    if (open) {
      controlCompletion()
    }
  }, [open, controlCompletion])

  const [loading, setLoading] = useState(false);
  const [sprintList, setSprintList] = useState<Sprint[]>([]);

  const fetchNonCompletedSprints = useCallback(async () => {
    if (!sprint.createdProject.id) {
      setLoading(false);
      return;
    }
    const sprintsData = await getNonCompletedSprintsHelper(sprint.createdProject.id, { setLoading });
    if (sprintsData) {
      setSprintList(sprintsData.filter(s => s.id !== sprint.id));
    } else {
      setSprintList([]);
    }
  }, [sprint.createdProject.id, sprint.id]);

  useEffect(() => {
    if (open) {
      fetchNonCompletedSprints();
    }
  }, [open, fetchNonCompletedSprints])

  const handleCompleteSprint = async () => {
    let body: UpdateSprintStatusRequest = {
      sprintId: sprint.id,
      newStatus: SprintStatus.COMPLETED
    };
    const response: CompletionResponseDto | null = await completeSprintHelper(body, { setLoading });
    if (response) {
      if (response.success) {
        setMessage({ text: response.message || translations.sprint.form.sprintCompleted, type: "success" });
        dispatch(updateSingleSprint(response.sprint));
        onOpenChange(false);
      } else {
        setMessage({ text: response.message || translations.sprint.form.completeSprintError, type: "error" });
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {translations.sprint.form.completeSprintTitle}: {sprint?.name}
          </DialogTitle>
          <DialogDescription>
            {translations.sprint.form.completeSprintDescription}
          </DialogDescription>
        </DialogHeader>

        {message.text && (
          <div
            className={`p-3 rounded mb-4 text-sm ${message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </div>
        ) : (
          <>
            <div className="py-4 space-y-6">
              {/* Task Statistics */}
              <div className="space-y-3">
                <h3 className="font-medium">{translations.sprint.form.sprintProgress}</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {translations.sprint.form.completionPercentage.replace("{percentage}", String(completionPercentage))}
                  </span>
                  <span>
                    {translations.sprint.form.progress
                      .replace("{completed}", String(completedTasks))
                      .replace("{total}", String(tasks.length))}
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />

                <div className="flex items-center gap-2 mt-3">
                  {tasks.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      {translations.sprint.form.noTaskInThisSprint}
                    </div>
                  )}
                  {tasks.length > 0 && completedTasks === tasks.length && (
                    <div className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {translations.sprint.form.allTaskCompleted}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>
                      {translations.sprint.form.totalTasks.replace("{total}", String(tasks.length))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>
                      {translations.sprint.form.completedTasks.replace("{completed}", String(completedTasks))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center text-sm text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>
                      {translations.sprint.form.inCompleteTasks.replace("{incomplete}", String(incompleteTasks))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Incomplete Task Handling */}
              {incompleteTasks > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">
                    {translations.sprint.form.incompleteTaskHandlingTitle}
                  </h3>
                  <RadioGroup
                    value={destination}
                    onValueChange={(value) => setDestination(value as "backlog" | "sprint")}
                  >
                    <div className="flex items-center space-x-2 py-2">
                      <RadioGroupItem value="backlog" id="backlog" />
                      <Label htmlFor="backlog">{translations.sprint.form.moveToBacklog}</Label>
                    </div>
                    <div className="flex items-center space-x-2 py-2">
                      <RadioGroupItem value="sprint" id="sprint" />
                      <Label htmlFor="sprint">{translations.sprint.form.moveToAnotherSprint}</Label>
                    </div>
                  </RadioGroup>

                  {destination === "sprint" && (
                    <div className="pl-6 pt-2">
                      <Label htmlFor="target-sprint" className="block mb-2">
                        {translations.sprint.form.selectTargetSprint}
                      </Label>
                      <Select value={targetSprintId} onValueChange={setTargetSprintId}>
                        <SelectTrigger id="target-sprint" className="w-full">
                          <SelectValue placeholder={translations.sprint.form.selectSprintPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{translations.sprint.form.availableSprints}</SelectLabel>
                            {sprintList.length > 0 ? (
                              sprintList.map((s: Sprint) => (
                                <SelectItem key={s.id} value={s.id || ""}>
                                  {s.name} - {s.sprintStatus}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-sprints" disabled>
                                {translations.sprint.form.noActiveSprints}
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {translations.sprint.form.cancel}
              </Button>
              {destination === "sprint" && !targetSprintId && incompleteTasks > 0 ? (
                <Button>{translations.sprint.form.completeSprint}</Button>
              ) : (
                <Button onClick={handleCompleteSprint} className="bg-green-600 hover:bg-green-700">
                  {destination === "backlog"
                    ? translations.sprint.form.moveToBacklogAndComplete
                    : destination === "sprint"
                      ? translations.sprint.form.moveToSprintAndComplete
                      : translations.sprint.form.completeSprint}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
