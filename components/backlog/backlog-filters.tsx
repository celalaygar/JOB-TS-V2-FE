"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Project } from "@/lib/redux/features/projects-slice"
import type { User } from "@/lib/redux/features/users-slice"
import { useLanguage } from "@/lib/i18n/context"

interface BacklogFiltersProps {
  filters: {
    search: string
    project: string
    priority: string
    assignee: string
    taskType: string
  }
  onFilterChange: (name: string, value: string) => void
  projects: Project[]
  users: User[]
}

export function BacklogFilters({ filters, onFilterChange, projects, users }: BacklogFiltersProps) {
  const { translations } = useLanguage()
  const t = translations.backlog.filters

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t.search}
          className="pl-8 w-full"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
        <Select value={filters.project} onValueChange={(value) => onFilterChange("project", value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t.project} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={(value) => onFilterChange("priority", value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t.priority} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="High">{t.high}</SelectItem>
            <SelectItem value="Medium">{t.medium}</SelectItem>
            <SelectItem value="Low">{t.low}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.assignee} onValueChange={(value) => onFilterChange("assignee", value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t.assignee} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.taskType} onValueChange={(value) => onFilterChange("taskType", value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t.taskType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="bug">{t.bug}</SelectItem>
            <SelectItem value="feature">{t.feature}</SelectItem>
            <SelectItem value="story">{t.story}</SelectItem>
            <SelectItem value="subtask">{t.subtask}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
