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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TeamMember } from "@/data/teams"

interface EditRoleDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember | null
  role: string
  onRoleChange: (role: string) => void
  onSave: () => void
}

export function EditRoleDialog({ isOpen, onOpenChange, member, role, onRoleChange, onSave }: EditRoleDialogProps) {
  if (!member) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Edit Team Role</DialogTitle>
          <DialogDescription>Change the role for {member.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              placeholder="Enter role title"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
