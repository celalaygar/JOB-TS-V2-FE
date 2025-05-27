"use client"

import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/context"

interface TeamDetailFiltersProps {
  filterStatus: string
  setFilterStatus: (status: "all" | "active" | "inactive" | "banned") => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  onAddMember: () => void
}

export function TeamDetailFilters({
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  onAddMember,
}: TeamDetailFiltersProps) {
  const { translations } = useLanguage()

  // Tab options
  const tabOptions = [
    { value: "all", label: translations.teams?.teamDetail.filters.all },
    { value: "active", label: translations.teams?.teamDetail.filters.active },
    { value: "inactive", label: translations.teams?.teamDetail.filters.inactive },
    { value: "banned", label: translations.teams?.teamDetail.filters.banned },
  ]

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
        {/* Custom tabs using div elements */}
        <div className="flex flex-col w-full md:w-auto space-y-4">
          <div className="flex overflow-x-auto bg-muted rounded-md p-1 w-full md:w-auto">
            {tabOptions.map((tab) => (
              <div
                key={tab.value}
                className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer whitespace-nowrap transition-colors
                  ${
                    filterStatus === tab.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
                  }`}
                onClick={() => setFilterStatus(tab.value as any)}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <div className="w-full md:w-64">
            <Input
              placeholder={translations.teams?.companyTeams.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <Button onClick={onAddMember} className="whitespace-nowrap w-full md:w-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          {translations.teams?.companyTeams.addMember}
        </Button>
      </div>
    </div>
  )
}
