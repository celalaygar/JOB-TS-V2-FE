"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/context"

interface CompanyTeamsSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CompanyTeamsSearch({ searchQuery, onSearchChange }: CompanyTeamsSearchProps) {
  const { translations } = useLanguage()

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={translations.teams?.companyTeams.search}
        className="pl-8 w-full"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}
