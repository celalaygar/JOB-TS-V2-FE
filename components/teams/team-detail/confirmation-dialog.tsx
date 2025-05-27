"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { TeamMember } from "@/data/teams"

interface ConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  actionType: "ban" | "deactivate" | "remove" | null
  member: TeamMember | null
  onConfirm: () => void
}

export function ConfirmationDialog({ isOpen, onOpenChange, actionType, member, onConfirm }: ConfirmationDialogProps) {
  if (!actionType || !member) return null

  const titles = {
    ban: "Ban Team Member",
    deactivate: "Deactivate Team Member",
    remove: "Remove Team Member",
  }

  const descriptions = {
    ban: "This will ban the member from accessing the team.",
    deactivate: "This will deactivate the member's access to the team.",
    remove: "This will permanently remove the member from the team.",
  }

  const buttonLabels = {
    ban: "Ban Member",
    deactivate: "Deactivate Member",
    remove: "Remove Member",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{titles[actionType]}</DialogTitle>
          <DialogDescription>{descriptions[actionType]}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p>
            Are you sure you want to {actionType} <span className="font-medium">{member.name}</span>?
            {actionType === "remove" && " This action cannot be undone."}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "ban" || actionType === "remove" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {buttonLabels[actionType]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
