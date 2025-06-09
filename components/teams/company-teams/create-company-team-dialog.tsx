"use client"

import type React from "react"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Company } from "@/data/companies"
import { useLanguage } from "@/lib/i18n/context"

interface CreateCompanyTeamDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  companies: Company[]
}

export function CreateCompanyTeamDialog({ isOpen, onOpenChange, companies }: CreateCompanyTeamDialogProps) {
  const { toast } = useToast()
  const { translations } = useLanguage()

  // Form state for creating a new team
  const [formData, setFormData] = useState({
    companyId: "",
    name: "",
    description: "",
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

    if (!formData.companyId) {
      newErrors.companyId = translations.teams?.companyTeams.company + " is required"
    }

    if (!formData.name.trim()) {
      newErrors.name = translations.teams?.companyTeams.teamName + " is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = translations.teams?.companyTeams.teamDescription + " is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Here you would typically save the new team to your data store
    toast({
      title: translations.teams?.companyTeams.teamCreated,
      description: `Team "${formData.name}" has been created successfully.`,
    })

    // Reset form and close dialog
    setFormData({
      companyId: "",
      name: "",
      description: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{translations.teams?.companyTeams.createTeam}</DialogTitle>
            <DialogDescription>
              Create a new team for a company. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company" className={errors.companyId ? "text-destructive" : ""}>
                {translations.teams?.companyTeams.company}
              </Label>
              <Select value={formData.companyId} onValueChange={(value) => handleChange("companyId", value)}>
                <SelectTrigger id="company" className={errors.companyId ? "border-destructive" : ""}>
                  <SelectValue placeholder={translations.teams?.companyTeams.selectCompany} />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companyId && <p className="text-xs text-destructive">{errors.companyId}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                {translations.teams?.companyTeams.teamName}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter team name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                {translations.teams?.companyTeams.teamDescription}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter team description"
                className={errors.description ? "border-destructive" : ""}
                rows={3}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{translations.teams?.companyTeams.createTeam}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
