"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, PlusCircle, Search, SortAsc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { useLanguage } from "@/lib/i18n/context"

export function ProjectsHeader() {
  const { translations } = useLanguage()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{translations.projects.title}</h1>
          <p className="text-[var(--fixed-sidebar-muted)]">{translations.projects.description}</p>
        </div>
        <button
          className="fixed-primary-button h-10 px-4 py-2 rounded-md flex items-center text-sm font-medium"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations.projects.newProject}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
          <Input
            type="search"
            placeholder={translations.projects.searchProjects}
            className="w-full pl-8 border-[var(--fixed-card-border)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">{translations.projects.filter}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
          >
            <SortAsc className="h-4 w-4" />
            <span className="sr-only">{translations.projects.sort}</span>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 rounded-md bg-[var(--fixed-secondary)] border border-[var(--fixed-card-border)]">
          <div>
            <label className="text-xs font-medium mb-1 block">{translations.projects.status}</label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full border-[var(--fixed-card-border)]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.projects.statusOptions.allStatus}</SelectItem>
                <SelectItem value="planning">{translations.projects.statusOptions.planned}</SelectItem>
                <SelectItem value="in-progress">{translations.projects.statusOptions.inProgress}</SelectItem>
                <SelectItem value="completed">{translations.projects.statusOptions.completed}</SelectItem>
                <SelectItem value="on-hold">{translations.projects.statusOptions.onHold}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Progress</label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full border-[var(--fixed-card-border)]">
                <SelectValue placeholder="Filter by progress" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Progress</SelectItem>
                <SelectItem value="0-25">0-25%</SelectItem>
                <SelectItem value="25-50">25-50%</SelectItem>
                <SelectItem value="50-75">50-75%</SelectItem>
                <SelectItem value="75-100">75-100%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Sort By</label>
            <Select defaultValue="name-asc">
              <SelectTrigger className="w-full border-[var(--fixed-card-border)]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="progress-asc">Progress (Low-High)</SelectItem>
                <SelectItem value="progress-desc">Progress (High-Low)</SelectItem>
                <SelectItem value="issues-asc">Issues (Low-High)</SelectItem>
                <SelectItem value="issues-desc">Issues (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
