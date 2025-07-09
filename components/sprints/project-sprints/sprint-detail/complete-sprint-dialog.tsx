"use client"

import { useCallback, useEffect, useState } from "react"
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
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Sprint, SprintStatus } from "@/types/sprint"
import { toast } from "@/hooks/use-toast"
import { getNonCompletedSprintsHelper } from "@/lib/service/api-helpers" // Import the new helper
import { saveUpdateSprintHelper } from "@/lib/service/api-helpers" // Import saveUpdateSprintHelper for dispatching updates
import { useLanguage } from "@/lib/i18n/context"
import { ProjectTask } from "@/types/task"


interface CompleteSprintDialogProps {
  sprint: Sprint // Using any for simplicity, but should be properly typed
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: any[] // Using any for simplicity, but should be properly typed
}

export function CompleteSprintDialog({ sprint, open, onOpenChange, tasks }: CompleteSprintDialogProps) {
  const dispatch = useDispatch()
  const { translations } = useLanguage()

  const [destination, setDestination] = useState<"backlog" | "sprint">("backlog")
  const [targetSprintId, setTargetSprintId] = useState<string>("")

  // Calculate task statistics
  const completedTasks = tasks.filter(
    (task: ProjectTask) => task.projectTaskStatus.id === sprint.taskStatusOnCompletion.id,
  ).length
  const incompleteTasks = tasks.length - completedTasks
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0


  const [loading, setLoading] = useState(false);
  const [sprintList, setSprintList] = useState<Sprint[] | []>([]);


  const fetchNonCompletedSprints = useCallback(async () => {
    if (!sprint.createdProject.id) { // Use sprint.projectId
      setLoading(false);
      return;
    }
    const sprintsData = await getNonCompletedSprintsHelper(sprint.createdProject.id, { setLoading }); // Use sprint.projectId and setLoading
    if (sprintsData) {
      // Filter out the current sprint from the list of target sprints
      setSprintList(sprintsData.filter(s => s.id !== sprint.id));
    } else {
      setSprintList([]);
    }
  }, [sprint?.projectId, sprint?.id]);


  useEffect(() => {
    if (open) { // Only fetch when dialog is open
      fetchNonCompletedSprints();
    }
  }, [open, fetchNonCompletedSprints])


  const handleCompleteSprint = async () => {
    setLoading(true); // Start loading for the completion process

    try {
      // Update sprint status to completed
      const updatedSprintData = {
        ...sprint,
        status: "completed" as SprintStatus, // Explicitly cast to SprintStatus
        updatedAt: new Date().toISOString(),
      };

      const response = await saveUpdateSprintHelper(updatedSprintData, { setLoading });

      if (response) {
        dispatch(updateSprint(response));
        // Logic for moving incomplete tasks would go here
        // This part currently uses dummy data/logic, would need actual API calls for tasks
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

        toast({
          title: "Sprint Completed",
          description: `Sprint "${sprint.name}" has been successfully completed.`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Completion Failed",
          description: "There was an error completing the sprint.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Failed to complete sprint:", error);
      toast({
        title: "Completion Failed",
        description: error.message || "An unexpected error occurred during sprint completion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Sprint: {sprint?.name}</DialogTitle>
          <DialogDescription>
            This will mark the sprint as completed and move incomplete tasks according to your selection.
          </DialogDescription>
        </DialogHeader>
        {
          loading ?
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center" >
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </div >
            :
            <>
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
                              {sprintList.length > 0 ? (
                                sprintList.map((sprint: Sprint) => (
                                  <SelectItem key={sprint.id} value={sprint.id || ""}> {/* Ensure value is string */}
                                    {sprint.name} - {sprint.sprintStatus}
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
            </>
        }
      </DialogContent>
    </Dialog>
  )
}
