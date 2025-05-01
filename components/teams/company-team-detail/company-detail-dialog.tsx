"use client"

import { Building2, Mail, MapPin, Phone, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n/context"
import type { Company } from "@/data/companies"

interface CompanyDetailDialogProps {
  company: Company
  open: boolean
  onClose: () => void
}

export function CompanyDetailDialog({ company, open, onClose }: CompanyDetailDialogProps) {
  const { translations } = useLanguage()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{translations.companies.companyDetails}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-lg font-medium mb-3">{translations.companies.basicInfo}</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Building2 className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-muted-foreground">{company.code}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{translations.companies.companyAddress}</p>
                  <p className="text-sm text-muted-foreground break-words">{company.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">{translations.companies.contactInfo}</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{translations.companies.companyPhone}</p>
                  <p className="text-sm text-muted-foreground">{company.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{translations.companies.companyEmail}</p>
                  <p className="text-sm text-muted-foreground break-words">{company.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Globe className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{translations.companies.companyWebsite}</p>
                  <p className="text-sm text-muted-foreground break-words">{company.website}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-3">{translations.companies.additionalInfo}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{translations.companies.companyIndustry}</p>
                <p className="text-sm text-muted-foreground">
                  {translations.companies.industry[company.industry as keyof typeof translations.companies.industry]}
                </p>
              </div>

              <div>
                <p className="font-medium">{translations.companies.companySize}</p>
                <p className="text-sm text-muted-foreground">
                  {translations.companies.size[company.size as keyof typeof translations.companies.size]}
                </p>
              </div>

              <div>
                <p className="font-medium">{translations.companies.companyStatus}</p>
                <p className="text-sm text-muted-foreground">
                  {translations.companies.status[company.status as keyof typeof translations.companies.status]}
                </p>
              </div>

              <div>
                <p className="font-medium">{translations.companies.companyFoundedDate}</p>
                <p className="text-sm text-muted-foreground">{company.foundedDate}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-2">{translations.companies.companyDescription}</h3>
            <p className="text-sm text-muted-foreground">{company.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
