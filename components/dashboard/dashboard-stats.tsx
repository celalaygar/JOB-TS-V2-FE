"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Clock, Folder } from "lucide-react"

export function DashboardStats() {
  // Use useState for all variables instead of Redux
  const totalProjects = 0
  const openIssues = 0
  const inProgressIssues = 0
  const completedIssues = 0
  const projectsChange = 0
  const openIssuesChange = 0
  const inProgressChange = 0
  const completedChange = 0


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Total Projects</h3>
          <Folder className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{projectsChange} from last month</p>
        </div>
      </div>
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Open Issues</h3>
          <AlertCircle className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{openIssues}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{openIssuesChange} from last week</p>
        </div>
      </div>
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">In Progress</h3>
          <Clock className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{inProgressIssues}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">
            {inProgressChange >= 0 ? `+${inProgressChange}` : `${inProgressChange}`} from last week
          </p>
        </div>
      </div>
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Completed</h3>
          <CheckCircle2 className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{completedIssues}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{completedChange} from last week</p>
        </div>
      </div>
    </div>
  )
}
