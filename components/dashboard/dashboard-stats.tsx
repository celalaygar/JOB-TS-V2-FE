"use client"

import { useSelector } from "react-redux"
import { AlertCircle, CheckCircle2, Clock, Folder } from "lucide-react"
import { RootState } from "@/lib/redux/store"
import { ProjectTask, ProjectTaskPriority } from "@/types/task"
import { useLanguage } from "@/lib/i18n/context"

export function DashboardStats() {
  const { translations } = useLanguage()
  const allProjects = useSelector((state: RootState) => state.projects.projects)
  const allTasks: ProjectTask[] | null = useSelector((state: RootState) => state.tasks.tasks)

  const criticalTasksCount = allTasks?.filter((task) => task.priority === ProjectTaskPriority.CRITICAL).length || 0
  const highTasksCount = allTasks?.filter((task) => task.priority === ProjectTaskPriority.HIGH).length || 0
  const mediumTasksCount = allTasks?.filter((task) => task.priority === ProjectTaskPriority.MEDIUM).length || 0
  const lowTasksCount = allTasks?.filter((task) => task.priority === ProjectTaskPriority.LOW).length || 0

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
      {/* Total Projects */}
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{translations.dashboard.totalProjects}</h3>
          <Folder className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{allProjects.length}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">
            +{allProjects.length} {translations.dashboard.fromLastTasks}
          </p>
        </div>
      </div>

      {/* Total Tasks */}
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{translations.dashboard.totalTasks}</h3>
          <AlertCircle className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{allTasks?.length || 0}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">
            +{allTasks?.length || 0} {translations.dashboard.fromLastTasks}
          </p>
        </div>
      </div>

      {/* Critical */}
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">
            {translations.dashboard.criticalTasks}
          </h3>
          <AlertCircle className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{criticalTasksCount}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">
            +{criticalTasksCount} {translations.dashboard.fromLastTasks}
          </p>
        </div>
      </div>

      {/* High */}
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">
            {translations.dashboard.highTasks}
          </h3>
          <Clock className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{highTasksCount}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">
            +{highTasksCount} {translations.dashboard.fromLastTasks}
          </p>
        </div>
      </div>

      {/* Medium */}
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">
            {translations.dashboard.mediumTasks}
          </h3>
          <CheckCircle2 className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{mediumTasksCount}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">
            +{mediumTasksCount} {translations.dashboard.fromLastTasks}
          </p>
        </div>
      </div>

      {/* Low */}
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">
            {translations.dashboard.lowTasks}
          </h3>
          <CheckCircle2 className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{lowTasksCount}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">
            +{lowTasksCount} {translations.dashboard.fromLastTasks}
          </p>
        </div>
      </div>
    </div>
  )
}
