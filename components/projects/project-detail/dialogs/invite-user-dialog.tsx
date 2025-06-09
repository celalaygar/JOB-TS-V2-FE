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
import BaseService from "@/lib/service/BaseService"
import { INVITE_TO_PROJECT } from "@/lib/service/BasePath"
import { httpMethods } from "@/lib/service/HttpService"
import { Project } from "@/types/project"

interface InviteUserDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}
interface InvıteUserRequest {
  projectId: string
  email: string
  userProjectRole: string
}

export function InviteUserDialog({ project, open, onOpenChange }: InviteUserDialogProps) {

  const [formData, setFormData] = useState<InvıteUserRequest>({ projectId: project.id, email: "", userProjectRole: "" })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);

    try {
      const response: InvıteUserRequest = await BaseService.request(INVITE_TO_PROJECT, {
        method: httpMethods.POST,
        body: { ...formData, projectId: project.id }
      })
      let data = response as InvıteUserRequest;
      // Show success toast
      toast({
        title: response.email + " User Invited ",
        description: response.email + " User Invited at " + new Date().toLocaleString(),
      })
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `User Invited failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('User Invited failed:', error)
        toast({
          title: `User Invited failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      // Close dialog
      setLoading(false);
      resetForm();
      onOpenChange(false)
    }


  }

  const resetForm = () => {
    setFormData({ projectId: project.id, email: "", userProjectRole: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} >
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
