"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Clock, Folder } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { ProjectTask, ProjectTaskPriority } from "@/types/task"

export function DashboardStats() {
  const allProjects = useSelector((state: RootState) => state.projects.projects)
  const allTasks: ProjectTask[] | null = useSelector((state: RootState) => state.tasks.tasks)
  const criticalTasksCount = allTasks?.filter((task) => task.priority === ProjectTaskPriority.CRITICAL).length
  const highTasksCount = allTasks?.filter((task) => task.priority === ProjectTaskPriority.HIGH).length
  const mediumTasksCount = allTasks?.filter((task) => task.priority === ProjectTaskPriority.MEDIUM).length
  const lowTasksCount = allTasks?.filter((task) => task.priority === ProjectTaskPriority.LOW).length




  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Total Projects</h3>
          <Folder className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{allProjects.length}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{allProjects.length} from last 20 task</p>
        </div>
      </div>
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{"Total"} Tasks</h3>
          <AlertCircle className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{allTasks?.length}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{allTasks?.length} from last 20 task</p>
        </div>
      </div>
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{ProjectTaskPriority.CRITICAL} Tasks</h3>
          <AlertCircle className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{criticalTasksCount}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{criticalTasksCount} from last 20 task</p>
        </div>
      </div>
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{ProjectTaskPriority.HIGH} Tasks</h3>
          <Clock className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{highTasksCount}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{highTasksCount} from last 20 task</p>
        </div>
      </div>
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{ProjectTaskPriority.MEDIUM} Tasks</h3>
          <CheckCircle2 className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{mediumTasksCount}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{mediumTasksCount} from last 20 task</p>
        </div>
      </div>
      <div className="fixed-card rounded-lg p-4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{ProjectTaskPriority.LOW} Tasks</h3>
          <CheckCircle2 className="h-4 w-4 text-[var(--fixed-primary)]" />
        </div>
        <div>
          <div className="text-2xl font-bold">{lowTasksCount}</div>
          <p className="text-xs text-[var(--fixed-sidebar-muted)]">+{lowTasksCount} from last 20 task</p>
        </div>
      </div>
    </div>
  )
}
