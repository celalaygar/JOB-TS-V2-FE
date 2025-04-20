"use client"

import { useState } from "react"
import { CompanyTeamsHeader } from "@/components/teams/company-teams/company-teams-header"
import { CompanyTeamsSearch } from "@/components/teams/company-teams/company-teams-search"
import { CompanyTeamsList } from "@/components/teams/company-teams/company-teams-list"
import { CreateCompanyTeamDialog } from "@/components/teams/company-teams/create-company-team-dialog"
import { CompanySelector } from "@/components/teams/company-teams/company-selector"
import { companiesWithTeams } from "@/data/company-teams"
import { companies } from "@/data/companies"

export default function CompanyTeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false)

  // Filter companies based on selected company
  const filteredCompanies = selectedCompanyId
    ? companiesWithTeams.filter((company) => company.companyId === selectedCompanyId)
    : companiesWithTeams

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleCompanyChange = (companyId: string | null) => {
    setSelectedCompanyId(companyId)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <CompanyTeamsHeader onCreateTeam={() => setIsCreateTeamDialogOpen(true)} />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <CompanySelector selectedCompanyId={selectedCompanyId} onCompanyChange={handleCompanyChange} />
        <CompanyTeamsSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      </div>

      <CompanyTeamsList companies={filteredCompanies} searchQuery={searchQuery} />

      <CreateCompanyTeamDialog
        isOpen={isCreateTeamDialogOpen}
        onOpenChange={setIsCreateTeamDialogOpen}
        companies={companies}
      />
    </div>
  )
}
