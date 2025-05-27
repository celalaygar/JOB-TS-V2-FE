"use client"

import { useState } from "react"
import { AlertTriangle, Ban, UserX, UserMinus } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

interface UserActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  onConfirm: (action: string, reason: string) => void
}

export function UserActionDialog({ open, onOpenChange, user, onConfirm }: UserActionDialogProps) {
  const [selectedAction, setSelectedAction] = useState<string>("remove")
  const [reason, setReason] = useState<string>("")

  const handleConfirm = () => {
    onConfirm(selectedAction, reason)
    setReason("")
    onOpenChange(false)
  }

  const actionIcons = {
    remove: <UserMinus className="h-5 w-5 text-red-500" />,
    ban: <Ban className="h-5 w-5 text-orange-500" />,
    deactivate: <UserX className="h-5 w-5 text-yellow-500" />,
  }

  const actionTitles = {
    remove: "Remove User",
    ban: "Ban User",
    deactivate: "Deactivate User",
  }

  const actionDescriptions = {
    remove: "This will permanently remove the user from this team. They will lose access to all team resources.",
    ban: "This will ban the user from the team. They will be unable to rejoin without admin approval.",
    deactivate: "This will temporarily deactivate the user's access to team resources.",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedAction && actionIcons[selectedAction as keyof typeof actionIcons]}
            {selectedAction && actionTitles[selectedAction as keyof typeof actionTitles]}
          </DialogTitle>
          <DialogDescription>
            {selectedAction && actionDescriptions[selectedAction as keyof typeof actionDescriptions]}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Select action for {user.name}</h3>
            <RadioGroup value={selectedAction} onValueChange={setSelectedAction} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remove" id="remove" />
                <Label htmlFor="remove" className="flex items-center gap-2">
                  <UserMinus className="h-4 w-4 text-red-500" />
                  Remove from team
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ban" id="ban" />
                <Label htmlFor="ban" className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-orange-500" />
                  Ban user
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deactivate" id="deactivate" />
                <Label htmlFor="deactivate" className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-yellow-500" />
                  Deactivate user
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason (optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Provide a reason for this action..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center text-amber-500">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-xs">This action cannot be undone</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
