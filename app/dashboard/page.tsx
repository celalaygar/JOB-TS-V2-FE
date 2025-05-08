"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentIssues } from "@/components/dashboard/recent-issues"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import { QuickNavigation } from "@/components/dashboard/quick-navigation"

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <DashboardHeader onCreateIssue={() => setIsCreateDialogOpen(true)} />
      <DashboardStats />
      <QuickNavigation />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentIssues />
        <ProjectProgress />
      </div>
    </div>
  )
}
