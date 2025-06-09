"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface EditCompanyUserDialogProps {
  user: any
  companyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCompanyUserDialog({ user, companyId, open, onOpenChange }: EditCompanyUserDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department || "",
    phone: user.phone || "",
  })

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "",
      phone: user.phone || "",
    })
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update the user
    const updatedUser = {
      ...user,
      ...formData,
      updatedAt: new Date().toISOString(),
    }

    // Dispatch action to update user
    // dispatch(updateUser(updatedUser))

    // Show success toast
    toast({
      title: translations.companies?.userUpdated || "User updated successfully",
      description: new Date().toLocaleString(),
    })

    // Close dialog
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{translations.companies?.editUser || "Edit User"}</DialogTitle>
          <DialogDescription>
            {translations.companies?.editUserDescription || "Make changes to the user information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{translations.companies?.userName || "Name"}</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{translations.companies?.userEmail || "Email"}</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">{translations.companies?.userRole || "Role"}</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{translations.companies?.roles?.admin || "Admin"}</SelectItem>
                    <SelectItem value="manager">{translations.companies?.roles?.manager || "Manager"}</SelectItem>
                    <SelectItem value="user">{translations.companies?.roles?.user || "User"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">{translations.companies?.userDepartment || "Department"}</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{translations.companies?.userPhone || "Phone"}</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{translations.companies?.updateUser || "Update User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
