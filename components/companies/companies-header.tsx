"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateCompanyDialog } from "./create-company-dialog"

export function CompaniesHeader() {
  const { translations } = useLanguage()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{translations.companies?.list}</h1>
        <p className="text-muted-foreground">{translations.companies?.description}</p>
      </div>
      <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full md:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        {translations.companies?.newCompany}
      </Button>
      <CreateCompanyDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
