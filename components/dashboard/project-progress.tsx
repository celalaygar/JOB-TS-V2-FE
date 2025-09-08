"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/context"
import { Project } from "@/types/project"

export function ProjectProgress() {
  const allProjects = useSelector((state: RootState) => state.projects.projects)
  const { translations } = useLanguage()


  return (
    <Card className="col-span-1 fixed-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{translations.dashboard.projectProgress}</CardTitle>
          <CardDescription className="text-[var(--fixed-sidebar-muted)]">
            {translations.dashboard.projectProgressDescription}
          </CardDescription>
        </div>
        <Link
          href="/projects"
          className="fixed-secondary-button h-9 px-3 py-2 rounded-md text-sm font-medium"
        >
          {translations.dashboard.viewAll}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allProjects.map((project: Project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm font-medium leading-none hover:underline"
                >
                  {project.name}
                </Link>
                <div className="flex items-center">
                  <span className="text-sm text-[var(--fixed-sidebar-muted)] mr-2">
                    {project.progress}%
                  </span>
                  <span
                    className={`
                      text-xs py-0.5 px-1.5 rounded-full
                      ${project.status === "Completed"
                        ? "bg-[var(--fixed-success)] text-white"
                        : project.status === "In Progress"
                          ? "bg-[var(--fixed-primary)] text-white"
                          : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                      }
                    `}
                  >
                    {project.status === "Completed" && translations.dashboard.statusCompleted}
                    {project.status === "In Progress" && translations.dashboard.statusInProgress}
                    {project.status !== "Completed" && project.status !== "In Progress" && translations.dashboard.statusPending}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--fixed-secondary)]">
                <div
                  className="h-full rounded-full bg-[var(--fixed-primary)]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-[var(--fixed-sidebar-muted)]">
                <span>{0} {translations.dashboard.tasks}</span>
                <span>{0} {translations.dashboard.teamMembers}</span>
              </div>
            </div>
          ))}

          {allProjects.length === 0 && (
            <div className="text-center py-6">
              <p className="text-[var(--fixed-sidebar-muted)]">
                {translations.dashboard.noProjects}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
