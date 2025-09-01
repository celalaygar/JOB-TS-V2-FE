"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Sprint, SprintStatus, UpdateSprintStatusRequest } from "@/types/sprint"
import { useLanguage } from "@/lib/i18n/context"
import { updateSprintStatustHelper } from "@/lib/service/helper/sprint-helper"


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

    const updatedSprintStatusRequest: UpdateSprintStatusRequest = {
      sprintId: sprint.id,
      newStatus: sprintStatus,
    };

    const response: Sprint | null = await updateSprintStatustHelper(updatedSprintStatusRequest, { setLoading });

    if (response) {
      dispatch(updateSingleSprint(response));
      onOpenChange(false);
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {translations.sprint.form.changeStatusTitle}

          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {translations.sprint.form.changeStatusDescription}
        </DialogDescription>
        <div className="mt-4">
          <Label className="text-sm font-medium">
            {translations.sprint.form.name}
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
        {
          loading ?
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </div>
            :
            <>
              <div className="mt-4">
                <Label className="text-sm font-medium">
                  {translations.sprint.form.status}
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
            </>
        }
        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            {translations.sprint.form.cancel}
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
