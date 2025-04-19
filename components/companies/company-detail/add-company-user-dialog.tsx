"use client"

import type React from "react"

import { useState } from "react"
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
import { v4 as uuidv4 } from "uuid"

interface AddCompanyUserDialogProps {
  companyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCompanyUserDialog({ companyId, open, onOpenChange }: AddCompanyUserDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    department: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a new user
    const newUser = {
      id: uuidv4(),
      companyId,
      ...formData,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Dispatch action to add user
    // dispatch(addUser(newUser))

    // Show success toast
    toast({
      title: translations.companies?.userAdded || "User added successfully",
      description: new Date().toLocaleString(),
    })

    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      role: "user",
      department: "",
      phone: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{translations.companies?.addUser || "Add User"}</DialogTitle>
          <DialogDescription>
            {translations.companies?.addUserDescription || "Add a new user to this company."}
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
            <Button type="submit">{translations.companies?.addUser || "Add User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
