"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SpendingRequestHeaderProps {
  onCreateRequest: () => void
  selectedYear: number
  availableYears: number[]
  onYearChange: (year: number) => void
}

export function SpendingRequestHeader({
  onCreateRequest,
  selectedYear,
  availableYears,
  onYearChange,
}: SpendingRequestHeaderProps) {
  const { translations } = useLanguage()

  return (
    <div className="mb-8">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold">{translations.requests.spending.title}</h1>
          <p className="text-muted-foreground">{translations.requests.spending.description}</p>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">{translations.requests.spending.workingYear}</span>
            <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number.parseInt(value))}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={translations.requests.spending.selectYear} />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={onCreateRequest} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            {translations.requests.spending.newRequest}
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">{translations.requests.spending.myRequests}</h2>
        <p className="text-muted-foreground">{translations.requests.spending.myRequestsDescription}</p>
      </div>
    </div>
  )
}
