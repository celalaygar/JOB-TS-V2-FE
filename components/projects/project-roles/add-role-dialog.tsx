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
import BaseService from "@/lib/service/BaseService"
import { PROJECT_USER_ROLES_URL } from "@/lib/service/BasePath"
import { toast } from "@/hooks/use-toast"
import { ProjectRole, ProjectRolePermission, ProjectRoleRequest } from "@/types/project-role"
import { Loader2 } from "lucide-react"

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
  const dispatch = useDispatch()
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isDefaultRole, setIsDefaultRole] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false);

  // const availablePermissions = [
  //   { id: "manage_members", label: "Manage Members", category: "Team" },
  //   { id: "manage_roles", label: "Manage Roles", category: "Team" },
  //   { id: "view_project", label: "View Project", category: "Project" },
  //   { id: "edit_project", label: "Edit Project", category: "Project" },
  //   { id: "delete_project", label: "Delete Project", category: "Project" },
  //   { id: "create_task", label: "Create Tasks", category: "Tasks" },
  //   { id: "edit_task", label: "Edit Tasks", category: "Tasks" },
  //   { id: "delete_task", label: "Delete Tasks", category: "Tasks" },
  //   { id: "assign_task", label: "Assign Tasks", category: "Tasks" },
  // ]

  // Group permissions by category
  let permissionsByCategory = {}
  if (permissionList != null) {
    permissionsByCategory = permissionList.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = []
        }
        acc[permission.category].push(permission)
        return acc
      },
      {} as Record<string, typeof permissionList>,
    )
  }

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {}

    // Role name validation
    if (!roleName.trim()) {
      newErrors.roleName = "Role name is required"
    } else if (roleName.trim().length < 2) {
      newErrors.roleName = "Role name must be at least 2 characters long"
    } else if (roleName.trim().length > 50) {
      newErrors.roleName = "Role name must not exceed 50 characters"
    }

    // Description validation
    if (roleDescription.trim().length > 255) {
      newErrors.description = "Description must not exceed 255 characters"
    }

    // Permissions validation
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
    let response: ProjectRole | null = await saveProjectUserRole(newRole);
    if (!response) {
      return;
    }
    dispatch(addRole(response))
    resetForm()
    onOpenChange(false)
  }


  const saveProjectUserRole = async (newRole: ProjectRoleRequest) => {
    let projectRole: ProjectRole | null = null;
    setLoading(true)
    try {
      const response: ProjectRole = await BaseService.request(PROJECT_USER_ROLES_URL, {
        method: 'POST',
        body: newRole
      })
      projectRole = response;
      toast({
        title: `Project user role saved.`,
        description: `Project User Role saved as ` + newRole.name,
      })
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })

      } else {
        console.error('Project User Role  failed:', error)
        toast({
          title: `Project User Role  find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
    return projectRole;
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

    // Clear permissions error when user selects at least one permission
    if (isSubmitted && errors.permissions && checked) {
      setErrors((prev) => ({ ...prev, permissions: undefined }))
    }
  }

  const handleRoleNameChange = (value: string) => {
    setRoleName(value)
    // Clear error when user starts typing
    if (isSubmitted && errors.roleName) {
      setErrors((prev) => ({ ...prev, roleName: undefined }))
    }
  }

  const handleDescriptionChange = (value: string) => {
    setRoleDescription(value)
    // Clear error when user starts typing
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
                        Description
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
                      Cancel
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
