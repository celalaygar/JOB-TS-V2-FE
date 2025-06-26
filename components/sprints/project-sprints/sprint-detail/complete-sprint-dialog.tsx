"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateSprint } from "@/lib/redux/features/sprints-slice"
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
import { CheckCircle, AlertCircle } from "lucide-react"
import { Sprint, SprintStatus } from "@/types/sprint"

interface CompleteSprintDialogProps {
  sprint: Sprint // Using any for simplicity, but should be properly typed
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: any[] // Using any for simplicity, but should be properly typed
}

export function CompleteSprintDialog({ sprint, open, onOpenChange, tasks }: CompleteSprintDialogProps) {
  const dispatch = useDispatch()
  const sprints = useSelector((state: RootState) => state.sprints.sprints)
  const currentSprint = sprints.find((s) => s.id === sprint.id)

  const [destination, setDestination] = useState<"backlog" | "sprint">("backlog")
  const [targetSprintId, setTargetSprintId] = useState<string>("")

  // Calculate task statistics
  const completedTasks = tasks.filter(
    (task) => task.status.toLowerCase() === "done" || task.status.toLowerCase() === "completed",
  ).length
  const incompleteTasks = tasks.length - completedTasks
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  // Get available sprints (excluding current sprint and completed sprints)
  const availableSprints = sprints.filter((s) => s.id !== sprint.id && s.sprintStatus !== SprintStatus.COMPLETED)

  const handleCompleteSprint = () => {
    // Update sprint status to completed
    dispatch(
      updateSprint({
        id: sprintId,
        changes: { status: "completed" },
      }),
    )

    // Here you would also handle moving incomplete tasks
    // This would typically involve dispatching actions to update tasks
    // For example:
    // if (destination === "backlog") {
    //   incompleteTasks.forEach(task => {
    //     dispatch(updateTask({
    //       id: task.id,
    //       changes: { sprint: null, backlog: true }
    //     }))
    //   })
    // } else if (destination === "sprint" && targetSprintId) {
    //   incompleteTasks.forEach(task => {
    //     dispatch(updateTask({
    //       id: task.id,
    //       changes: { sprint: targetSprintId }
    //     }))
    //   })
    // }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Sprint: {currentSprint?.name}</DialogTitle>
          <DialogDescription>
            This will mark the sprint as completed and move incomplete tasks according to your selection.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Task Statistics */}
          <div className="space-y-3">
            <h3 className="font-medium">Sprint Progress</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>Completion: {completionPercentage}%</span>
              <span>
                {completedTasks} of {tasks.length} tasks completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>{completedTasks} completed tasks</span>
              </div>
              {incompleteTasks > 0 && (
                <div className="flex items-center text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{incompleteTasks} incomplete tasks</span>
                </div>
              )}
            </div>
          </div>

          {/* Incomplete Task Handling */}
          {incompleteTasks > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">What would you like to do with incomplete tasks?</h3>
              <RadioGroup value={destination} onValueChange={(value) => setDestination(value as "backlog" | "sprint")}>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="backlog" id="backlog" />
                  <Label htmlFor="backlog">Move to backlog</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="sprint" id="sprint" />
                  <Label htmlFor="sprint">Move to another sprint</Label>
                </div>
              </RadioGroup>

              {destination === "sprint" && (
                <div className="pl-6 pt-2">
                  <Label htmlFor="target-sprint" className="block mb-2">
                    Select target sprint:
                  </Label>
                  <Select value={targetSprintId} onValueChange={setTargetSprintId}>
                    <SelectTrigger id="target-sprint" className="w-full">
                      <SelectValue placeholder="Select a sprint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Sprints</SelectLabel>
                        {availableSprints.length > 0 ? (
                          availableSprints.map((sprint) => (
                            <SelectItem key={sprint.id} value={sprint.id}>
                              {sprint.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-sprints" disabled>
                            No active sprints available
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
            Cancel
          </Button>
          {destination === "sprint" && !targetSprintId && incompleteTasks > 0 ? (
            <Button disabled>Complete Sprint</Button>
          ) : (
            <Button onClick={handleCompleteSprint} className="bg-green-600 hover:bg-green-700">
              {destination === "backlog"
                ? "Move to Backlog & Complete"
                : destination === "sprint"
                  ? "Move to Sprint & Complete"
                  : "Complete Sprint"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
