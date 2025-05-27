"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateSprint } from "@/lib/redux/features/sprints-slice"
import { updateIssue } from "@/lib/redux/features/issues-slice"
import { Progress } from "@/components/ui/progress"

interface CompleteSprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sprintId: string
}

export function CompleteSprintDialog({ open, onOpenChange, sprintId }: CompleteSprintDialogProps) {
  const dispatch = useDispatch()
  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))
  const allIssues = useSelector((state: RootState) => state.issues.issues)
  const allSprints = useSelector((state: RootState) =>
    state.sprints.sprints.filter((s) => s.id !== sprintId && s.status !== "completed"),
  )

  // Get tasks for this sprint
  const sprintTasks = allIssues.filter((issue) => issue.sprint === sprintId)

  // Count completed vs incomplete tasks
  const completedTasks = sprintTasks.filter((task) => task.status === "done").length
  const incompleteTasks = sprintTasks.length - completedTasks

  const [incompleteTaskAction, setIncompleteTaskAction] = useState<"backlog" | "sprint">("backlog")
  const [targetSprintId, setTargetSprintId] = useState<string>("")

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setIncompleteTaskAction("backlog")
      setTargetSprintId(allSprints.length > 0 ? allSprints[0].id : "")
    }
  }, [open, allSprints])

  const handleSubmit = () => {
    // Mark sprint as completed
    dispatch(
      updateSprint({
        id: sprintId,
        changes: {
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      }),
    )

    // Handle incomplete tasks
    sprintTasks.forEach((task) => {
      if (task.status !== "done") {
        // Move to backlog or another sprint based on selection
        dispatch(
          updateIssue({
            id: task.id,
            changes: {
              sprint: incompleteTaskAction === "backlog" ? "backlog" : targetSprintId,
              updatedAt: new Date().toISOString(),
            },
          }),
        )
      }
    })

    onOpenChange(false)
  }

  // Calculate completion percentage
  const completionPercentage = sprintTasks.length > 0 ? Math.round((completedTasks / sprintTasks.length) * 100) : 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Sprint</DialogTitle>
          <DialogDescription>
            Review sprint completion status and decide what to do with incomplete tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sprint Completion Status</h3>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {completedTasks} of {sprintTasks.length} tasks completed
              </span>
              <span>{completionPercentage}%</span>
            </div>
          </div>

          {incompleteTasks > 0 && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">
                  What would you like to do with {incompleteTasks} incomplete tasks?
                </h3>
                <RadioGroup
                  value={incompleteTaskAction}
                  onValueChange={(value) => setIncompleteTaskAction(value as "backlog" | "sprint")}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="backlog" id="backlog" />
                    <Label htmlFor="backlog" className="font-normal cursor-pointer">
                      Move to backlog
                      <p className="text-sm text-muted-foreground">
                        All incomplete tasks will be moved to the backlog for future planning.
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="sprint" id="sprint" disabled={allSprints.length === 0} />
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="sprint" className="font-normal cursor-pointer">
                        Move to another sprint
                        <p className="text-sm text-muted-foreground">
                          All incomplete tasks will be moved to the selected sprint.
                        </p>
                      </Label>
                      {incompleteTaskAction === "sprint" && (
                        <Select
                          value={targetSprintId}
                          onValueChange={setTargetSprintId}
                          disabled={allSprints.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sprint" />
                          </SelectTrigger>
                          <SelectContent>
                            {allSprints.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[var(--fixed-primary)] text-white">
            {incompleteTaskAction === "backlog" ? "Complete & Move to Backlog" : "Complete & Move to Sprint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
