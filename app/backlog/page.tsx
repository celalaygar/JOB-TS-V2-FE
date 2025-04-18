"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { BacklogTable } from "@/components/backlog/backlog-table"
import { BacklogFilters } from "@/components/backlog/backlog-filters"
import { LanguageProvider } from "@/lib/i18n/context"
import { BacklogHeader } from "@/components/backlog/backlog-header"

export default function BacklogPage() {
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)

  const [filters, setFilters] = useState({
    search: "",
    project: "all",
    priority: "all",
    assignee: "all",
    taskType: "all",
  })

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <LanguageProvider>
      <div className="flex flex-col h-full">
        <BacklogHeader />
        <div className="p-6 space-y-6 flex-1 overflow-auto">
          <BacklogFilters filters={filters} onFilterChange={handleFilterChange} projects={projects} users={users} />
          <BacklogTable filters={filters} />
        </div>
      </div>
    </LanguageProvider>
  )
}
