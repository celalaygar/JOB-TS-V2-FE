"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, FilterX, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Project, ProjectTeam } from "@/types/project"
import { getAllProjectTeamsByProjectIdHelper } from "@/lib/service/api-helpers" // Import the new helper
import { useLanguage } from "@/lib/i18n/context"

interface ProjectSprintsFiltersProps {
  filters: {
    project: string
    team: string
    status: string
    dateRange: DateRange | undefined
  }
  projectList: Project[] | []
  onFilterChange: (filters: any) => void
  teams: any[]
}

export function ProjectSprintsFilters({ projectList, filters, onFilterChange, teams }: ProjectSprintsFiltersProps) {
  const { translations } = useLanguage()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(filters.dateRange)
  const [projectTeams, setProjectTeams] = useState<ProjectTeam[]>([]);

  const [loading, setLoading] = useState(false);

  const handleProjectChange = useCallback(async (value: string) => {
    onFilterChange({ ...filters, project: value });
    setProjectTeams([]); // Clear teams when project changes
    if (!!value && value !== "all") {
      const teamsData = await getAllProjectTeamsByProjectIdHelper(value, { setLoading });
      if (teamsData) {
        setProjectTeams(teamsData);
      }
    }
  }, [filters, onFilterChange, setLoading]);


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
      project: "",
      team: "",
      status: "",
      dateRange: undefined,
    })
  }

  return (
    <div className="bg-[var(--fixed-card-bg)] border border-[var(--fixed-card-border)] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{translations.sprint.filters}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
        >
          <FilterX className="mr-2 h-4 w-4" />
          {translations.sprint.resetFilters}
        </Button>
      </div>
      {
        loading ?
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </div>
          :
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">{translations.sprint.project}</Label>
                <Select value={filters.project} onValueChange={handleProjectChange}>
                  <SelectTrigger id="project" className="border-[var(--fixed-card-border)]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{translations.sprint.allProject}</SelectItem>
                    {!!projectList && projectList.map((project: Project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">{translations.sprint.team}</Label>
                <Select value={filters.team} onValueChange={handleTeamChange}>
                  <SelectTrigger id="team" className="border-[var(--fixed-card-border)]">
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {!!projectTeams && projectTeams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{translations.sprint.status}</Label>
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
                <Label>{translations.sprint.dateRange}</Label>
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
          </>
      }
    </div>
  )
}
