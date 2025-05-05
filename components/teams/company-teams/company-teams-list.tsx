"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import { CompanyTeamCard } from "./company-team-card"
import type { CompanyWithTeams } from "@/data/company-teams"
import { useLanguage } from "@/lib/i18n/context"

interface CompanyTeamsListProps {
  companies: CompanyWithTeams[]
  searchQuery: string
}

export function CompanyTeamsList({ companies, searchQuery }: CompanyTeamsListProps) {
  const { translations } = useLanguage()

  // Filter companies and teams based on search query
  const filteredCompanies = companies.filter((company) => {
    // Check if company name matches search
    if (company.companyName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true
    }

    // Check if any team name matches search
    return company.teams.some(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  })

  if (filteredCompanies.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{translations.teams?.companyTeams.noTeams}</h3>
          <p className="text-muted-foreground text-center mt-2">
            {searchQuery ? "Try adjusting your search query" : "There are no teams created yet"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Accordion type="multiple" defaultValue={filteredCompanies.map((p) => p.companyId)} className="space-y-4">
      {filteredCompanies.map((company) => (
        <AccordionItem key={company.companyId} value={company.companyId} className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center">
              <span className="font-medium">{company.companyName}</span>
              <Badge variant="outline" className="ml-2">
                {company.teams.length} {company.teams.length === 1 ? "team" : "teams"}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {company.teams.map((team) => (
                <CompanyTeamCard key={team.id} team={team} companyId={company.companyId} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
