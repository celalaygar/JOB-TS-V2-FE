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
import { toast } from "@/hooks/use-toast"
import { ProjectRole, ProjectRolePermission, ProjectRoleRequest } from "@/types/project-role"
import { Loader2 } from "lucide-react"
import { createProjectUserRoleHelper } from "@/lib/service/api-helpers" // Import the new helper
import { useLanguage } from "@/lib/i18n/context"

interface AddRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  permissionList: ProjectRolePermission[] | null
}

interface ValidationErrors {
  roleName?: string
  description?: string
  order?: string
  permissions?: string
}

export function AddRoleDialog({ open, onOpenChange, projectId, permissionList }: AddRoleDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isDefaultRole, setIsDefaultRole] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false);

  let permissionsByCategory: Record<string, ProjectRolePermission[]> = {}
  if (permissionList != null) {
    permissionsByCategory = permissionList.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = []
        }
        acc[permission.category].push(permission)
        return acc
      },
      {} as Record<string, ProjectRolePermission[]>,
    )
  }

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {}

    if (!roleName.trim()) {
      newErrors.roleName = "Role name is required"
    } else if (roleName.trim().length < 2) {
      newErrors.roleName = "Role name must be at least 2 characters long"
    } else if (roleName.trim().length > 50) {
      newErrors.roleName = "Role name must not exceed 50 characters"
    }

    if (roleDescription.trim().length > 255) {
      newErrors.description = "Description must not exceed 255 characters"
    }

    if (selectedPermissions.length === 0) {
      newErrors.permissions = "At least one permission must be selected"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    const newRole: ProjectRoleRequest = {
      projectId,
      name: roleName.trim(),
      description: roleDescription.trim(),
      permissions: selectedPermissions,
      isDefaultRole
    }

    const response: ProjectRole | null = await createProjectUserRoleHelper(newRole, { setLoading });
    if (response) {
      dispatch(addRole(response))
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setRoleName("")
    setRoleDescription("")
    setSelectedPermissions([])
    setIsDefaultRole(false)
    setErrors({})
    setIsSubmitted(false)
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId))
    }

    if (isSubmitted && errors.permissions && checked) {
      setErrors((prev) => ({ ...prev, permissions: undefined }))
    }
  }

  const handleRoleNameChange = (value: string) => {
    setRoleName(value)
    if (isSubmitted && errors.roleName) {
      setErrors((prev) => ({ ...prev, roleName: undefined }))
    }
  }

  const handleDescriptionChange = (value: string) => {
    setRoleDescription(value)
    if (isSubmitted && errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Create a new role with specific permissions for this project.</DialogDescription>
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Role Name
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="name"
                          value={roleName}
                          onChange={(e) => handleRoleNameChange(e.target.value)}
                          className={`${errors.roleName ? "border-red-500 focus:border-red-500" : ""}`}
                          placeholder="e.g., Project Manager"
                          required
                        />
                        {errors.roleName && <p className="text-sm text-red-500 mt-1">{errors.roleName}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        {translations.projects.description}
                      </Label>
                      <div className="col-span-3">

                        <Textarea
                          id="description"
                          value={roleDescription}
                          onChange={(e) => handleDescriptionChange(e.target.value)}
                          className={`${errors.description ? "border-red-500 focus:border-red-500" : ""}`}
                          placeholder="Describe the role's responsibilities"
                        />
                        <p className="text-sm text-right text-gray-500 mt-1">{roleDescription.trim().length}</p>
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isDefaultRole" className="text-right">
                        Default Role
                      </Label>
                      <div className="flex items-center space-x-2 col-span-3">
                        <Checkbox
                          id="isDefaultRole"
                          checked={isDefaultRole}
                          onCheckedChange={(checked) => setIsDefaultRole(!!checked)}
                        />
                        <label
                          htmlFor="isDefaultRole"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Set as default role for new project members
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">Permissions</Label>
                      <div className="col-span-3">
                        <ScrollArea className={`h-[200px] rounded-md border p-4 ${errors.permissions ? "border-red-500" : ""}`}>
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
                        {errors.permissions && <p className="text-sm text-red-500 mt-1">{errors.permissions}</p>}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                      {translations.projects.cancel}
                    </Button>
                    <Button type="submit">Create Role</Button>
                  </DialogFooter>
                </>
            }
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
