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


interface ChangeSprintStatusDailogProps {
  sprint: Sprint // Using any for simplicity, but should be properly typed
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangeSprintStatusDailog({ sprint, open, onOpenChange }: ChangeSprintStatusDailogProps) {
  const dispatch = useDispatch()
  const { translations } = useLanguage()


  const [loading, setLoading] = useState(false)
  const [sprintStatus, setSprintStatus] = useState(sprint.sprintStatus || SprintStatus.ACTIVE)


  const handleCompleteSprint = async () => {

    const updatedSprintData = {
      ...sprint,
      status: SprintStatus.ACTIVE,
    };

    const response = await saveUpdateSprintHelper(updatedSprintData, { setLoading });

    if (response) {
      dispatch(updateSprint(response));

      onOpenChange(false);
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Change Sprint Status to do Active or Planned

          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to change the sprint status to Active? This action cannot be undone.
        </DialogDescription>
        <div className="mt-4">
          <Label className="text-sm font-medium">
            Sprint Name
          </Label>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{sprint.name}</span>
              <span className="text-xs text-gray-500">
                {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString() : "N/A"} - {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Label className="text-sm font-medium">
            Sprint Status
          </Label>
          <Select value={sprintStatus} onValueChange={setSprintStatus}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select sprint status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={SprintStatus.ACTIVE}>
                  {translations.sprint.statusOptions.active}
                </SelectItem>
                <SelectItem value={SprintStatus.PLANNED}>
                  {translations.sprint.statusOptions.planned}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCompleteSprint}
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {translations.sprint.form.doActive}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
