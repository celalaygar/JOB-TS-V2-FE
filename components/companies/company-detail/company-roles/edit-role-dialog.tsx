"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
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
import { updateCompanyRole } from "@/lib/redux/features/company-roles-slice"
import { COMPANY_PERMISSIONS, type CompanyPermission, type CompanyRole } from "@/types/company-role"

interface EditRoleDialogProps {
  role: CompanyRole
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditRoleDialog({ role, open, onOpenChange }: EditRoleDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()

  const [name, setName] = useState(role.name)
  const [description, setDescription] = useState(role.description)
  const [selectedPermissions, setSelectedPermissions] = useState<CompanyPermission[]>(role.permissions)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  // Update form when role changes
  useEffect(() => {
    setName(role.name)
    setDescription(role.description)
    setSelectedPermissions(role.permissions)
  }, [role])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { name?: string; description?: string } = {}
    if (!name.trim()) {
      newErrors.name = translations.validation?.required || "Name is required"
    }
    if (!description.trim()) {
      newErrors.description = translations.validation?.required || "Description is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    // Dispatch action to update role
    dispatch(
      updateCompanyRole({
        ...role,
        name,
        description,
        permissions: selectedPermissions,
      }),
    )

    // Close dialog
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const handlePermissionChange = (permission: CompanyPermission, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permission])
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{translations.companies?.editRole || "Edit Role"}</DialogTitle>
            <DialogDescription>
              {translations.companies?.editRoleDescription || "Modify this role's details and permissions"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{translations.common?.name || "Name"}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={translations.companies?.roleName || "Role name"}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">{translations.common?.description || "Description"}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={translations.companies?.roleDescription || "Role description"}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid gap-2">
              <Label>{translations.companies?.permissions || "Permissions"}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {COMPANY_PERMISSIONS.map((permission) => (
                  <div key={permission.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission-${permission.value}`}
                      checked={selectedPermissions.includes(permission.value)}
                      onCheckedChange={(checked) => handlePermissionChange(permission.value, checked as boolean)}
                    />
                    <Label htmlFor={`permission-${permission.value}`} className="text-sm font-normal">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              {translations.common?.cancel || "Cancel"}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? translations.common?.saving || "Saving..." : translations.common?.save || "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
