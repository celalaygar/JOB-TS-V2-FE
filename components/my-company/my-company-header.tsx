"use client"

import { useLanguage } from "@/lib/i18n/context"
import { myCompanyData } from "@/data/my-company"

export function MyCompanyHeader() {
  const { translations: t } = useLanguage()

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.myCompany.title}</h1>
        <p className="text-muted-foreground">{myCompanyData.name}</p>
      </div>
    </div>
  )
}
