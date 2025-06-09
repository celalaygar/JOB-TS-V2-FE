"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface CompanyTeamsHeaderProps {
  onCreateTeam: () => void
}

export function CompanyTeamsHeader({ onCreateTeam }: CompanyTeamsHeaderProps) {
  const { translations } = useLanguage()

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{translations.teams?.companyTeams.title}</h1>
        <p className="text-muted-foreground">{translations.teams?.companyTeams.description}</p>
      </div>

      <Button onClick={onCreateTeam}>
        <Plus className="h-4 w-4 mr-2" />
        {translations.teams?.companyTeams.newTeam}
      </Button>
    </div>
  )
}
