"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { companies } from "@/data/companies"
import { useLanguage } from "@/lib/i18n/context"

interface CompanySelectorProps {
  selectedCompanyId: string | null
  onCompanyChange: (companyId: string | null) => void
}

export function CompanySelector({ selectedCompanyId, onCompanyChange }: CompanySelectorProps) {
  const { translations } = useLanguage()

  const selectedCompany = selectedCompanyId ? companies.find((company) => company.id === selectedCompanyId) : null

  return (
    <div className="w-full md:w-[200px]">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {selectedCompany ? selectedCompany.name : translations.teams?.companyTeams.selectCompany}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={translations.teams?.companyTeams.search} />
            <CommandList>
              <CommandEmpty>{translations.teams?.companyTeams.noTeams}</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={() => onCompanyChange(null)} className="cursor-pointer">
                  <Check className={cn("mr-2 h-4 w-4", !selectedCompanyId ? "opacity-100" : "opacity-0")} />
                  {translations.teams?.companyTeams.selectCompany}
                </CommandItem>
                {companies.map((company) => (
                  <CommandItem key={company.id} onSelect={() => onCompanyChange(company.id)} className="cursor-pointer">
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedCompanyId === company.id ? "opacity-100" : "opacity-0")}
                    />
                    {company.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
