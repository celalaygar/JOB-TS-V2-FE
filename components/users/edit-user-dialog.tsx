"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateUser } from "@/lib/redux/features/users-slice"
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

interface EditUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({ userId, open, onOpenChange }: EditUserDialogProps) {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.users.users.find((u) => u.id === userId))
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
      })
    }
  }, [user])

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

    if (!validateForm() || !user) return

    // Generate new initials if name changed
    let initials = user.initials
    if (user.name !== formData.name) {
      const nameParts = formData.name.split(" ")
      initials =
        nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}` : nameParts[0].substring(0, 2)
      initials = initials.toUpperCase()
    }

    dispatch(
      updateUser({
        id: userId,
        changes: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          phone: formData.phone,
          initials,
        },
      }),
    )

    onOpenChange(false)
    setErrors({})
  }

  // Check if current user is admin or self
  const isAdmin = currentUser?.role === "Admin"
  const isSelf = currentUser?.id === userId

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. {!isAdmin && "As a non-admin, you can only edit your own profile."}
            </DialogDescription>
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
                className={errors.email ? "border-[var(--fixed-danger)]" : "border-[var(--fixed-card-border)]"}
              />
              {errors.email && <p className="text-xs text-[var(--fixed-danger)]">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role" className={errors.role ? "text-[var(--fixed-danger)]" : ""}>
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                  disabled={!isAdmin} // Only admins can change roles
                >
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
