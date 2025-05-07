"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
import { updateCompany } from "@/lib/redux/features/companies-slice"
import type { Company } from "@/data/companies"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface EditCompanyDialogProps {
  company: Company
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCompanyDialog({ company, open, onOpenChange }: EditCompanyDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Company>(company)

  useEffect(() => {
    setFormData(company)
  }, [company])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update the company with the new data
    const updatedCompany: Company = {
      ...formData,
      updatedAt: new Date().toISOString(),
    }

    // Dispatch the action to update the company
    dispatch(updateCompany(updatedCompany))

    // Show success toast
    toast({
      title: translations.companies?.companyUpdated,
      description: new Date().toLocaleString(),
    })

    // Close dialog
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{translations.companies?.editCompany}</DialogTitle>
          <DialogDescription>{translations.companies?.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{translations.companies?.companyName}</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">{translations.companies?.companyCode}</Label>
                <Input id="code" name="code" value={formData.code} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{translations.companies?.companyAddress}</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">{translations.companies?.country || "Country"}</Label>
                <Input id="country" name="country" value={formData.country || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{translations.companies?.city || "City"}</Label>
                <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">{translations.companies?.district || "District"}</Label>
                <Input id="district" name="district" value={formData.district || ""} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{translations.companies?.companyPhone}</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{translations.companies?.companyEmail}</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{translations.companies?.companyWebsite}</Label>
              <Input id="website" name="website" value={formData.website} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">{translations.companies?.companyStatus}</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{translations.companies?.status.active}</SelectItem>
                    <SelectItem value="inactive">{translations.companies?.status.inactive}</SelectItem>
                    <SelectItem value="pending">{translations.companies?.status.pending}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">{translations.companies?.companyIndustry}</Label>
                <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">{translations.companies?.industry.technology}</SelectItem>
                    <SelectItem value="healthcare">{translations.companies?.industry.healthcare}</SelectItem>
                    <SelectItem value="finance">{translations.companies?.industry.finance}</SelectItem>
                    <SelectItem value="education">{translations.companies?.industry.education}</SelectItem>
                    <SelectItem value="retail">{translations.companies?.industry.retail}</SelectItem>
                    <SelectItem value="manufacturing">{translations.companies?.industry.manufacturing}</SelectItem>
                    <SelectItem value="consulting">{translations.companies?.industry.consulting}</SelectItem>
                    <SelectItem value="other">{translations.companies?.industry.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">{translations.companies?.companySize}</Label>
                <Select value={formData.size} onValueChange={(value) => handleSelectChange("size", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">{translations.companies?.size.small}</SelectItem>
                    <SelectItem value="medium">{translations.companies?.size.medium}</SelectItem>
                    <SelectItem value="large">{translations.companies?.size.large}</SelectItem>
                    <SelectItem value="enterprise">{translations.companies?.size.enterprise}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedDate">{translations.companies?.companyFoundedDate}</Label>
              <Input
                id="foundedDate"
                name="foundedDate"
                type="date"
                value={formData.foundedDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{translations.companies?.companyDescription}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">{translations.companies?.contactPerson}</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">{translations.companies?.contactEmail}</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">{translations.companies?.contactPhone}</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{translations.companies?.updateCompany}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
