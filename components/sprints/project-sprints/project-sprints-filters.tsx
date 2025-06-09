"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, FilterX } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

interface ProjectSprintsFiltersProps {
  filters: {
    team: string
    status: string
    dateRange: DateRange | undefined
  }
  onFilterChange: (filters: any) => void
  teams: any[]
}

export function ProjectSprintsFilters({ filters, onFilterChange, teams }: ProjectSprintsFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(filters.dateRange)

  const handleTeamChange = (value: string) => {
    onFilterChange({ ...filters, team: value })
  }

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    onFilterChange({ ...filters, dateRange: range })
  }

  const handleResetFilters = () => {
    setDateRange(undefined)
    onFilterChange({
      team: "",
      status: "",
      dateRange: undefined,
    })
  }

  return (
    <div className="bg-[var(--fixed-card-bg)] border border-[var(--fixed-card-border)] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
        >
          <FilterX className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team">Team</Label>
          <Select value={filters.team} onValueChange={handleTeamChange}>
            <SelectTrigger id="team" className="border-[var(--fixed-card-border)]">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.name}>
                  {team.name}
                </SelectItem>
              ))}
              <SelectItem value="none">Project-wide (No Team)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="border-[var(--fixed-card-border)]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-[var(--fixed-card-border)]",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
