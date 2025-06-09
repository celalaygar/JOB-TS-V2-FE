"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, Edit, Trash, Power, PowerOff } from "lucide-react"
import type { Company } from "@/data/companies"

interface CompanyDetailHeaderProps {
  company: Company
  onEdit: () => void
  onDelete: () => void
  onActivate: () => void
  onDeactivate: () => void
}

export function CompanyDetailHeader({ company, onEdit, onDelete, onActivate, onDeactivate }: CompanyDetailHeaderProps) {
  const { translations } = useLanguage()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
          <p className="text-muted-foreground">{translations.companies?.companyDetails}</p>
        </div>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button onClick={onEdit} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          {translations.companies?.editCompany}
        </Button>

        {company.status !== "active" ? (
          <Button
            onClick={onActivate}
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
          >
            <Power className="mr-2 h-4 w-4" />
            {translations.companies?.activateCompany}
          </Button>
        ) : (
          <Button
            onClick={onDeactivate}
            variant="outline"
            className="bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700"
          >
            <PowerOff className="mr-2 h-4 w-4" />
            {translations.companies?.deactivateCompany}
          </Button>
        )}

        <Button
          onClick={onDelete}
          variant="outline"
          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
        >
          <Trash className="mr-2 h-4 w-4" />
          {translations.companies?.deleteCompany}
        </Button>
      </div>
    </div>
  )
}
