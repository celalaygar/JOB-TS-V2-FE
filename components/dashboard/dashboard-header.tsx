"use client"

import { useLanguage } from "@/lib/i18n/context"
import { PlusCircle } from "lucide-react"

interface DashboardHeaderProps {
  onCreateIssue: () => void
}

export function DashboardHeader({ onCreateIssue }: DashboardHeaderProps) {
  const { translations } = useLanguage()
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{translations.dashboard.title}</h1>
        <p className="text-[var(--fixed-sidebar-muted)]">
          {translations.dashboard.subtitle}
        </p>
      </div>
      <button
        className="fixed-primary-button h-10 px-4 py-2 rounded-md flex items-center text-sm font-medium sm:w-auto"
        onClick={onCreateIssue}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {translations.dashboard.newTask}
      </button>
    </div>
  )
}
