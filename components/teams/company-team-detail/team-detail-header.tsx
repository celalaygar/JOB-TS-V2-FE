"use client"

import Link from "next/link"
import { ArrowLeft, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import type { CompanyTeam } from "@/data/company-teams"

interface TeamDetailHeaderProps {
  team: CompanyTeam
  onViewCompanyDetails: () => void
}

export function TeamDetailHeader({ team, onViewCompanyDetails }: TeamDetailHeaderProps) {
  const { translations } = useLanguage()

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex items-center">
        <Link href="/teams/company-teams">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{translations.teams?.companyTeams.backToTeams}</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col space-y-4 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{team.name}</h1>
            <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1 mt-2 md:mt-0 w-full md:w-auto"
            onClick={onViewCompanyDetails}
          >
            <Building2 className="h-4 w-4" />
            {translations.teams?.companyTeams.viewCompanyDetails}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">
            {team.members.length} {team.members.length === 1 ? "member" : "members"}
          </span>
        </div>
      </div>
    </div>
  )
}
