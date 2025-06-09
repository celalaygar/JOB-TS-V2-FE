"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addUser } from "@/lib/redux/features/users-slice"
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

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Developer",
    department: "Engineering",
    phone: "",
    avatar: "/placeholder.svg",
  })

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.role) {
      newErrors.role = "Role is required"
    }

    if (!formData.department) {
      newErrors.department = "Department is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Generate initials from name
    const nameParts = formData.name.split(" ")
    const initials =
      nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}` : nameParts[0].substring(0, 2)

    dispatch(
      addUser({
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        phone: formData.phone,
        avatar: formData.avatar,
        initials: initials.toUpperCase(),
      }),
    )

    onOpenChange(false)

    // Reset form
    setFormData({
      name: "",
      email: "",
      role: "Developer",
      department: "Engineering",
      phone: "",
      avatar: "/placeholder.svg",
    })
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account. Fill in all the required information.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={errors.name ? "text-[var(--fixed-danger)]" : ""}>
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="John Smith"
                className={errors.name ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.name && <p className="text-xs text-[var(--fixed-danger)]">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className={errors.email ? "text-[var(--fixed-danger)]" : ""}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john.smith@example.com"
                className={errors.email ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.email && <p className="text-xs text-[var(--fixed-danger)]">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role" className={errors.role ? "text-[var(--fixed-danger)]" : ""}>
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                  <SelectTrigger
                    id="role"
                    className={errors.role ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Tester">Tester</SelectItem>
                    <SelectItem value="Product Owner">Product Owner</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-[var(--fixed-danger)]">{errors.role}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="department" className={errors.department ? "text-[var(--fixed-danger)]" : ""}>
                  Department
                </Label>
                <Select value={formData.department} onValueChange={(value) => handleChange("department", value)}>
                  <SelectTrigger
                    id="department"
                    className={errors.department ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-[var(--fixed-danger)]">{errors.department}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className={errors.phone ? "text-[var(--fixed-danger)]" : ""}>
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={errors.phone ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.phone && <p className="text-xs text-[var(--fixed-danger)]">{errors.phone}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[var(--fixed-primary)] text-white">
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
