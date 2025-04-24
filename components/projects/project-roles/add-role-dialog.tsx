"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addRole } from "@/lib/redux/features/project-roles-slice"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AddRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function AddRoleDialog({ open, onOpenChange, projectId }: AddRoleDialogProps) {
  const dispatch = useDispatch()
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isDefault, setIsDefault] = useState(false)

  const availablePermissions = [
    { id: "view_project", label: "View Project", category: "Project" },
    { id: "edit_project", label: "Edit Project", category: "Project" },
    { id: "delete_project", label: "Delete Project", category: "Project" },
    { id: "manage_members", label: "Manage Members", category: "Team" },
    { id: "manage_roles", label: "Manage Roles", category: "Team" },
    { id: "create_task", label: "Create Tasks", category: "Tasks" },
    { id: "edit_task", label: "Edit Tasks", category: "Tasks" },
    { id: "delete_task", label: "Delete Tasks", category: "Tasks" },
    { id: "assign_task", label: "Assign Tasks", category: "Tasks" },
    { id: "create_issue", label: "Create Issues", category: "Issues" },
    { id: "edit_issue", label: "Edit Issues", category: "Issues" },
    { id: "delete_issue", label: "Delete Issues", category: "Issues" },
    { id: "assign_issue", label: "Assign Issues", category: "Issues" },
  ]

  // Group permissions by category
  const permissionsByCategory = availablePermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof availablePermissions>,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!roleName.trim()) {
      alert("Role name is required")
      return
    }

    const newRole = {
      id: `role-${Date.now()}`,
      projectId,
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions,
      isDefault,
      order: 999, // Will be sorted later
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch(addRole(newRole))
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setRoleName("")
    setRoleDescription("")
    setSelectedPermissions([])
    setIsDefault(false)
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create a new role with specific permissions for this project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Role Name
              </Label>
              <Input
                id="name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Project Manager"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="col-span-3"
                placeholder="Describe the role's responsibilities"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isDefault" className="text-right">
                Default Role
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox id="isDefault" checked={isDefault} onCheckedChange={(checked) => setIsDefault(!!checked)} />
                <label
                  htmlFor="isDefault"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Make this the default role for new members
                </label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Permissions</Label>
              <div className="col-span-3">
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-sm">{category} Permissions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                              />
                              <label
                                htmlFor={permission.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
