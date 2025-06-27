"use client"

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
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Project } from "@/types/project"
import { inviteUserToProjectHelper } from "@/lib/service/api-helpers" // Import the new helper

interface InviteUserDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}
interface InviteUserRequest { // Renamed to avoid conflict if already defined elsewhere
  projectId: string
  email: string
  userProjectRole: string
}

export function InviteUserDialog({ project, open, onOpenChange }: InviteUserDialogProps) {

  const [formData, setFormData] = useState<InviteUserRequest>({ projectId: project.id, email: "", userProjectRole: "" })
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }
  const handleChangeRole = (role: string) => {
    setFormData((prev) => ({ ...prev, ["userProjectRole"]: role }))
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await inviteUserToProjectHelper({ ...formData, projectId: project.id }, { setLoading });

    if (response) {
      resetForm();
      onOpenChange(false);
    }
  }

  const resetForm = () => {
    setFormData({ projectId: project.id, email: "", userProjectRole: "" })
    setErrors({}); // Also clear errors on form reset
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleInviteUser} >
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Invite a user to join this project.</DialogDescription>
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
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      onChange={(e) => handleChange("email", e.target.value)}
                      id="email"
                      value={formData.email}
                      type="email"
                      placeholder="Enter email address" />
                    {errors.name && <p className="text-xs text-[var(--fixed-danger)]">{errors.name}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      value={formData.userProjectRole}
                      onChange={(e) => handleChangeRole(e.target.value)}
                      id="userProjectRole"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a role</option> {/* Added a default empty option */}
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="product-manager">Product Manager</option>
                      <option value="tester">Tester</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </>
          }
        </form>
      </DialogContent>
    </Dialog>
  )
}
